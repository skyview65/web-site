extends Node3D
## LUMENFALL — Bölge Dolaşımı (serbest uçuş modu)
## main.gd ile AYNI neon görsel dili, ama SERBEST DOLAŞIM oynanışı.
## Bütün dünya (şehir, ışıklar, ızgara, kamera, HUD) bu betikte kod içinde
## kurulur; hazır varlık (asset) gerektirmez. Bağımsız bir betiktir; main.gd'yi
## etkilemez. openworld.tscn yalnızca bu betiği taşıyan tek bir Node3D içerir.
##
## Amaç: hover-craft'ı sabit neon şehir bölgesinde serbestçe uçur ve 12 Lümen
## halkasını yakınlıkla topla. Hepsi toplanınca bölge temizlenir.

# --- ayarlanabilir sabitler ---------------------------------------------------
const HALF := 240.0            # şehir bölgesinin yarı-genişliği (kare: 480x480)
const NEON := [Color(0.40, 0.91, 0.98), Color(0.94, 0.67, 0.99), Color(0.99, 0.83, 0.30)]
const LUMEN_TOTAL := 12        # toplanacak Lümen sayısı
const PICK_RADIUS_SQ := 100.0  # mesafe^2 eşiği (~10 birim) ile toplama

# uçuş dinamiği
const TURN_SPEED := 1.8        # yaw dönüş hızı (rad/s)
const ACCEL := 70.0            # gaz ivmesi
const MAX_SPEED := 92.0        # ileri tavan hız
const REVERSE_SPEED := 26.0    # geri tavan hız
const DRAG := 0.8              # sürtünme katsayısı (/s) — bırakınca yavaşlatır
const VERT_SPEED := 34.0       # dikey (yüksel/alçal) hız
const MIN_Y := 3.0
const MAX_Y := 150.0

# --- durum --------------------------------------------------------------------
enum State { IDLE, PLAYING, CLEARED }
var state: int = State.IDLE

var craft: MeshInstance3D
var camera: Camera3D
var lumens: Array = []          # her eleman: { node, active, pos }

var yaw := 0.0                  # craft yönü (radyan)
var fwd_speed := 0.0            # anlık ileri hız
var craft_pos := Vector3(0.0, 14.0, 0.0)
var lumen_count := 0

var hud: Label
var center_title: Label
var center_sub: Label


func _ready() -> void:
	randomize()
	_build_environment()
	_build_grid()
	_build_boundary()
	_build_city()
	_build_craft()
	_build_lumens()
	_build_hud()
	_show_idle()


# --- kurulum ------------------------------------------------------------------
func _build_environment() -> void:
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0.02, 0.02, 0.05)
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.20, 0.20, 0.34)
	env.ambient_light_energy = 0.6
	env.tonemap_mode = Environment.TONE_MAPPER_ACES
	env.tonemap_exposure = 1.1
	env.fog_enabled = true
	env.fog_light_color = Color(0.04, 0.03, 0.08)
	env.fog_density = 0.006
	env.glow_enabled = true
	env.glow_intensity = 0.9
	env.glow_strength = 1.1
	env.glow_bloom = 0.25
	env.glow_hdr_threshold = 0.85
	for i in range(5):
		env.set_glow_level(i, 1.0 if i >= 1 else 0.6)

	var we := WorldEnvironment.new()
	we.environment = env
	add_child(we)

	var sun := DirectionalLight3D.new()
	sun.light_color = Color(0.55, 0.65, 1.0)
	sun.light_energy = 0.6
	sun.rotation_degrees = Vector3(-55, -30, 0)
	add_child(sun)

	camera = Camera3D.new()
	camera.fov = 72.0
	camera.current = true
	camera.position = Vector3(0, 26, 34)
	add_child(camera)

	# zemin (bölgeyi geniş biçimde kaplar)
	var ground := MeshInstance3D.new()
	var pm := PlaneMesh.new()
	pm.size = Vector2(HALF * 4.0, HALF * 4.0)
	ground.mesh = pm
	var gmat := StandardMaterial3D.new()
	gmat.albedo_color = Color(0.03, 0.03, 0.07)
	gmat.metallic = 0.2
	gmat.roughness = 0.8
	ground.mesh.surface_set_material(0, gmat)
	ground.position = Vector3(0, 0, 0)
	add_child(ground)


func _make_neon_material(col: Color, energy: float) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = Color(0.02, 0.02, 0.03)
	m.emission_enabled = true
	m.emission = col
	m.emission_energy_multiplier = energy
	m.metallic = 0.1
	m.roughness = 0.5
	return m


func _build_grid() -> void:
	# GridHelper eşdeğeri: emisif neon ince şeritlerden ızgara.
	var gmat := StandardMaterial3D.new()
	gmat.albedo_color = Color(0, 0, 0)
	gmat.emission_enabled = true
	gmat.emission = Color(0.10, 0.36, 0.50)
	gmat.emission_energy_multiplier = 1.1
	var step := 40.0
	var span := HALF * 2.0
	var n := int(round(span / step))
	for i in range(n + 1):
		var c := -HALF + i * step
		# Z sabit — X ekseni boyunca çizgi
		var line_x := MeshInstance3D.new()
		var bx := BoxMesh.new()
		bx.size = Vector3(span, 0.06, 0.4)
		line_x.mesh = bx
		line_x.mesh.surface_set_material(0, gmat)
		line_x.position = Vector3(0, 0.04, c)
		add_child(line_x)
		# X sabit — Z ekseni boyunca çizgi
		var line_z := MeshInstance3D.new()
		var bz := BoxMesh.new()
		bz.size = Vector3(0.4, 0.06, span)
		line_z.mesh = bz
		line_z.mesh.surface_set_material(0, gmat)
		line_z.position = Vector3(c, 0.04, 0)
		add_child(line_z)


func _build_boundary() -> void:
	# Bölge sınırı: zemine yatık ince tor halka (XZ düzleminde, ekseni Y).
	var ring := MeshInstance3D.new()
	var tm := TorusMesh.new()
	tm.outer_radius = HALF * 1.5
	tm.inner_radius = HALF * 1.5 - 3.0
	ring.mesh = tm
	ring.mesh.surface_set_material(0, _make_neon_material(NEON[1], 3.0))
	ring.position = Vector3(0, 1.0, 0)
	add_child(ring)


func _build_city() -> void:
	# Ortak, koyu bina gövde malzemesi (main.gd stiliyle).
	var body_mat := StandardMaterial3D.new()
	body_mat.albedo_color = Color(0.04, 0.04, 0.08)
	body_mat.metallic = 0.35
	body_mat.roughness = 0.55
	body_mat.emission_enabled = true
	body_mat.emission = Color(0.05, 0.06, 0.12)
	body_mat.emission_energy_multiplier = 0.5

	var cell := 60.0
	var cols := int(round((HALF * 2.0) / cell))  # 8x8 = 64 hücre
	for gx in range(cols):
		for gz in range(cols):
			if randf() < 0.28:
				continue  # bazı hücreler boş = sokak
			var cx := -HALF + cell * 0.5 + gx * cell + randf_range(-8.0, 8.0)
			var cz := -HALF + cell * 0.5 + gz * cell + randf_range(-8.0, 8.0)
			_make_building(cx, cz, body_mat)


func _make_building(cx: float, cz: float, body_mat: StandardMaterial3D) -> void:
	var w := randf_range(14.0, 30.0)
	var d := randf_range(14.0, 30.0)
	var h := randf_range(24.0, 110.0)

	var node := MeshInstance3D.new()
	node.mesh = BoxMesh.new()
	var box: BoxMesh = node.mesh as BoxMesh
	box.size = Vector3(w, h, d)
	node.mesh.surface_set_material(0, body_mat)
	node.position = Vector3(cx, h * 0.5, cz)
	add_child(node)

	# emisif neon çatı bandı (rastgele renk)
	var cap := MeshInstance3D.new()
	cap.mesh = BoxMesh.new()
	var cbox: BoxMesh = cap.mesh as BoxMesh
	cbox.size = Vector3(w * 1.06, 2.4, d * 1.06)
	var col: Color = NEON[randi_range(0, NEON.size() - 1)]
	cap.mesh.surface_set_material(0, _make_neon_material(col, 3.0))
	cap.position = Vector3(cx, h + 1.2, cz)
	add_child(cap)


func _build_craft() -> void:
	craft = MeshInstance3D.new()
	var body := BoxMesh.new()
	body.size = Vector3(3.2, 1.1, 6.2)
	craft.mesh = body
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.04, 0.13, 0.18)
	mat.emission_enabled = true
	mat.emission = NEON[0]
	mat.emission_energy_multiplier = 2.2
	mat.metallic = 0.6
	mat.roughness = 0.3
	craft.mesh.surface_set_material(0, mat)
	craft.position = craft_pos
	add_child(craft)

	# kanatlar
	var wing := MeshInstance3D.new()
	var wb := BoxMesh.new()
	wb.size = Vector3(7.4, 0.32, 2.2)
	wing.mesh = wb
	wing.mesh.surface_set_material(0, _make_neon_material(NEON[1], 1.6))
	wing.position = Vector3(0, 0, 1.4)
	craft.add_child(wing)


func _build_lumens() -> void:
	# 12 Lümen: sabit (deterministik) altın-açı spirali ile bölgeye dağıtılmış.
	for i in range(LUMEN_TOTAL):
		var node := MeshInstance3D.new()
		var tm := TorusMesh.new()
		tm.inner_radius = 2.2
		tm.outer_radius = 3.6
		node.mesh = tm
		node.mesh.surface_set_material(0, _make_neon_material(NEON[2], 3.4))
		var pos := _lumen_spot(i)
		node.position = pos
		add_child(node)
		lumens.append({ "node": node, "active": true, "pos": pos })


func _lumen_spot(i: int) -> Vector3:
	var ang := i * 2.399963  # altın açı → eşit yayılım
	var rad := 30.0 + (float(i) / float(LUMEN_TOTAL)) * (HALF - 50.0)
	var x := cos(ang) * rad
	var z := sin(ang) * rad
	var y := 10.0 + fmod(float(i) * 13.0, 52.0)
	return Vector3(x, y, z)


func _build_hud() -> void:
	var layer := CanvasLayer.new()
	add_child(layer)

	hud = Label.new()
	hud.position = Vector2(24, 18)
	hud.add_theme_font_size_override("font_size", 22)
	hud.add_theme_color_override("font_color", Color(0.85, 0.95, 1.0))
	layer.add_child(hud)

	# Güvenilir merkezleme: anchor'ları tam-dikdörtgene doğrudan ata
	# (anchors_preset _ready sırasında etkisiz kalabilir). Başlık merkezin biraz
	# üstünde, alt yazı biraz altında.
	center_title = Label.new()
	center_title.anchor_right = 1.0
	center_title.anchor_bottom = 1.0
	center_title.offset_bottom = -70.0
	center_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	center_title.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	center_title.add_theme_font_size_override("font_size", 56)
	center_title.add_theme_color_override("font_color", Color(0.90, 0.97, 1.0))
	layer.add_child(center_title)

	center_sub = Label.new()
	center_sub.anchor_right = 1.0
	center_sub.anchor_bottom = 1.0
	center_sub.offset_top = 70.0
	center_sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	center_sub.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	center_sub.add_theme_font_size_override("font_size", 22)
	center_sub.add_theme_color_override("font_color", Color(0.55, 0.85, 0.95))
	layer.add_child(center_sub)


# --- durum geçişleri ----------------------------------------------------------
func _show_idle() -> void:
	state = State.IDLE
	center_title.text = "BÖLGE DOLAŞIMI"
	center_sub.text = "BOŞLUK ile başla   ·   Dön: A/D   Gaz: W/S   Yüksel: BOŞLUK   Alçal: SHIFT"
	hud.text = ""


func _start() -> void:
	state = State.PLAYING
	yaw = 0.0
	fwd_speed = 0.0
	craft_pos = Vector3(0.0, 14.0, 0.0)
	lumen_count = 0
	craft.visible = true
	craft.position = craft_pos
	craft.rotation.y = yaw
	center_title.text = ""
	center_sub.text = ""
	for l in lumens:
		l["active"] = true
		l["node"].visible = true


func _cleared() -> void:
	state = State.CLEARED
	center_title.text = "BÖLGE TEMİZLENDİ"
	center_sub.text = "Tüm Lümenler toplandı   ·   BOŞLUK ile yeniden başla"


# --- ana döngü ----------------------------------------------------------------
func _process(delta: float) -> void:
	if Input.is_key_pressed(KEY_SPACE) or Input.is_key_pressed(KEY_ENTER):
		if state != State.PLAYING:
			_start()

	if state == State.PLAYING:
		_update_play(delta)

	_spin_lumens(delta)
	_update_camera(delta)


func _update_play(delta: float) -> void:
	# dönüş (yaw)
	if Input.is_key_pressed(KEY_A):
		yaw += TURN_SPEED * delta
	if Input.is_key_pressed(KEY_D):
		yaw -= TURN_SPEED * delta

	# gaz + sürtünme
	var throttle := 0.0
	if Input.is_key_pressed(KEY_W):
		throttle += 1.0
	if Input.is_key_pressed(KEY_S):
		throttle -= 1.0
	fwd_speed += throttle * ACCEL * delta
	fwd_speed -= fwd_speed * DRAG * delta  # sürtünme ile yavaşlar
	fwd_speed = clampf(fwd_speed, -REVERSE_SPEED, MAX_SPEED)

	# dikey
	var vy := 0.0
	if Input.is_key_pressed(KEY_SPACE):
		vy += VERT_SPEED
	if Input.is_key_pressed(KEY_SHIFT):
		vy -= VERT_SPEED

	# konum güncelle — ileri vektör yaw'a göre
	var fwd := Vector3(sin(yaw), 0.0, -cos(yaw))
	craft_pos += fwd * fwd_speed * delta
	craft_pos.y += vy * delta
	craft_pos.x = clampf(craft_pos.x, -HALF, HALF)
	craft_pos.z = clampf(craft_pos.z, -HALF, HALF)
	craft_pos.y = clampf(craft_pos.y, MIN_Y, MAX_Y)

	craft.position = craft_pos
	craft.rotation.y = yaw

	# yakınlık ile Lümen toplama
	for l in lumens:
		if not l["active"]:
			continue
		if craft_pos.distance_squared_to(l["pos"]) < PICK_RADIUS_SQ:
			l["active"] = false
			l["node"].visible = false
			lumen_count += 1
			if lumen_count >= LUMEN_TOTAL:
				_cleared()

	hud.text = "LÜMEN  %d/%d      HIZ  %d" % [lumen_count, LUMEN_TOTAL, int(round(absf(fwd_speed)))]


func _spin_lumens(delta: float) -> void:
	for l in lumens:
		if l["active"]:
			l["node"].rotate_y(delta * 1.5)


func _update_camera(delta: float) -> void:
	# Takip kamerası: craft'ın arkasında (ileri vektörün tersinde) ve yukarıda.
	var fwd := Vector3(sin(yaw), 0.0, -cos(yaw))
	var desired := craft_pos - fwd * 22.0 + Vector3(0.0, 10.0, 0.0)
	camera.position = camera.position.lerp(desired, min(1.0, delta * 4.0))
	camera.look_at(craft_pos + fwd * 8.0 + Vector3(0.0, 2.0, 0.0), Vector3.UP)
