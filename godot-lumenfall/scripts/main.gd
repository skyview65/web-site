extends Node3D
## LUMENFALL — Neon Sürüş
## Godot 4 ile yapılmış, tek dosyada tamamen prosedürel bir 3B neon uçuş
## prototipi. Bütün dünya (şehir, ışıklar, kamera, HUD) bu betikte kod içinde
## kurulur; hazır varlık (asset) gerektirmez. main.tscn yalnızca bu betiği
## taşıyan tek bir Node3D içerir.
##
## Amaç: hover-craft'ı LUMENFALL'un neon kanyonunda uçur, PANOPT dronlarından
## kaç, Lümen topla. Hız ve tehdit mesafeyle artar. Şehir sonsuzdur: bina
## sıraları kameranın arkasından ufka geri döner.

# --- ayarlanabilir sabitler ---------------------------------------------------
const AVENUE := 22.0           # craft'ın yatayda gezebileceği yarı-genişlik
const ROWS := 26               # eşzamanlı bina sırası
const PER_SIDE := 3            # her yanda bina sayısı
const ROW_SPACING := 26.0      # sıralar arası Z mesafesi
const CORRIDOR := ROWS * ROW_SPACING
const NEON := [Color(0.40, 0.91, 0.98), Color(0.94, 0.67, 0.99), Color(0.99, 0.83, 0.30)]

# --- durum --------------------------------------------------------------------
enum State { IDLE, PLAYING, OVER }
var state: int = State.IDLE

var craft: MeshInstance3D
var camera: Camera3D
var buildings: Array = []       # her eleman: { node, cap, x, w, d, h, z }
var lumens: Array = []          # { node, active, x, y, z }
var drones: Array = []          # { node, active, x, y, z }

var ship_x := 0.0
var ship_y := 10.0
var speed := 34.0
var meters := 0.0
var lumen_count := 0
var best := 0

var drone_timer := 1.5
var lumen_timer := 0.6

var hud: Label
var center_title: Label
var center_sub: Label


func _ready() -> void:
	randomize()
	_build_environment()
	_build_city()
	_build_craft()
	_build_pickups()
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
	env.fog_density = 0.012
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
	camera.fov = 70.0
	camera.current = true
	camera.position = Vector3(0, 14, 42)
	add_child(camera)

	# zemin
	var ground := MeshInstance3D.new()
	var pm := PlaneMesh.new()
	pm.size = Vector2(4000, 4000)
	ground.mesh = pm
	var gmat := StandardMaterial3D.new()
	gmat.albedo_color = Color(0.03, 0.03, 0.07)
	gmat.metallic = 0.2
	gmat.roughness = 0.75
	ground.mesh.surface_set_material(0, gmat)
	ground.position = Vector3(0, 0, -800)
	add_child(ground)

	# yol çizgileri (emisif neon şeritler)
	for i in range(2):
		var line := MeshInstance3D.new()
		var lb := BoxMesh.new()
		lb.size = Vector3(0.6, 0.05, CORRIDOR + 200)
		line.mesh = lb
		var lmat := StandardMaterial3D.new()
		lmat.albedo_color = Color(0, 0, 0)
		lmat.emission_enabled = true
		lmat.emission = NEON[0] if i == 0 else NEON[1]
		lmat.emission_energy_multiplier = 2.4
		line.mesh.surface_set_material(0, lmat)
		line.position = Vector3((-AVENUE if i == 0 else AVENUE), 0.05, -700)
		add_child(line)


func _make_neon_material(col: Color, energy: float) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = Color(0.02, 0.02, 0.03)
	m.emission_enabled = true
	m.emission = col
	m.emission_energy_multiplier = energy
	m.metallic = 0.1
	m.roughness = 0.5
	return m


func _build_city() -> void:
	var build_mat := StandardMaterial3D.new()
	build_mat.albedo_color = Color(0.04, 0.04, 0.08)
	build_mat.metallic = 0.35
	build_mat.roughness = 0.55
	build_mat.emission_enabled = true
	build_mat.emission = Color(0.05, 0.06, 0.12)
	build_mat.emission_energy_multiplier = 0.5

	for r in range(ROWS):
		for side in range(2):
			for k in range(PER_SIDE):
				var node := MeshInstance3D.new()
				node.mesh = BoxMesh.new()
				node.mesh.surface_set_material(0, build_mat)
				add_child(node)

				var cap := MeshInstance3D.new()
				cap.mesh = BoxMesh.new()
				var col: Color = NEON[(r + side + k) % NEON.size()]
				cap.mesh.surface_set_material(0, _make_neon_material(col, 3.0))
				add_child(cap)

				var info := {
					"node": node, "cap": cap,
					"x": 0.0, "w": 0.0, "d": 0.0, "h": 0.0,
					"z": 20.0 - r * ROW_SPACING, "side": side, "k": k,
				}
				buildings.append(info)
				_randomize_building(info)


func _randomize_building(b: Dictionary) -> void:
	var dir := -1.0 if b["side"] == 0 else 1.0
	var lane: float = AVENUE + 8.0 + b["k"] * 30.0 + randf_range(0.0, 12.0)
	b["x"] = dir * lane
	b["w"] = randf_range(10.0, 22.0)
	b["d"] = randf_range(10.0, 20.0)
	b["h"] = randf_range(16.0, 40.0 + b["k"] * 40.0)
	var col: Color = NEON[randi_range(0, NEON.size() - 1)]
	var cap: MeshInstance3D = b["cap"]
	cap.mesh.surface_set_material(0, _make_neon_material(col, 3.0))


func _place_building(b: Dictionary) -> void:
	var node: MeshInstance3D = b["node"]
	var box: BoxMesh = node.mesh
	box.size = Vector3(b["w"], b["h"], b["d"])
	node.position = Vector3(b["x"], b["h"] * 0.5, b["z"])
	var cap: MeshInstance3D = b["cap"]
	var cbox: BoxMesh = cap.mesh
	cbox.size = Vector3(b["w"] * 1.05, 2.2, b["d"] * 1.05)
	cap.position = Vector3(b["x"], b["h"] + 1.1, b["z"])


func _build_craft() -> void:
	craft = MeshInstance3D.new()
	var body := BoxMesh.new()
	body.size = Vector3(3.0, 1.0, 6.0)
	craft.mesh = body
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.04, 0.13, 0.18)
	mat.emission_enabled = true
	mat.emission = NEON[0]
	mat.emission_energy_multiplier = 2.2
	mat.metallic = 0.6
	mat.roughness = 0.3
	craft.mesh.surface_set_material(0, mat)
	craft.position = Vector3(0, 10, 6)
	add_child(craft)

	# kanatlar
	var wing := MeshInstance3D.new()
	var wb := BoxMesh.new()
	wb.size = Vector3(7.0, 0.3, 2.0)
	wing.mesh = wb
	wing.mesh.surface_set_material(0, _make_neon_material(NEON[1], 1.6))
	wing.position = Vector3(0, 0, 1.4)
	craft.add_child(wing)


func _build_pickups() -> void:
	for i in range(10):
		var node := MeshInstance3D.new()
		var tm := TorusMesh.new()
		tm.inner_radius = 0.9
		tm.outer_radius = 1.5
		node.mesh = tm
		node.mesh.surface_set_material(0, _make_neon_material(NEON[2], 3.2))
		node.visible = false
		add_child(node)
		lumens.append({ "node": node, "active": false, "x": 0.0, "y": 0.0, "z": 0.0 })

	for i in range(8):
		var node := MeshInstance3D.new()
		var sm := SphereMesh.new()
		sm.radius = 1.6
		sm.height = 3.2
		node.mesh = sm
		node.mesh.surface_set_material(0, _make_neon_material(NEON[1], 2.6))
		node.visible = false
		add_child(node)
		drones.append({ "node": node, "active": false, "x": 0.0, "y": 0.0, "z": 0.0 })


func _build_hud() -> void:
	var layer := CanvasLayer.new()
	add_child(layer)

	hud = Label.new()
	hud.position = Vector2(24, 18)
	hud.add_theme_font_size_override("font_size", 22)
	hud.add_theme_color_override("font_color", Color(0.85, 0.95, 1.0))
	layer.add_child(hud)

	center_title = Label.new()
	center_title.anchors_preset = Control.PRESET_CENTER
	center_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	center_title.position = Vector2(0, -40)
	center_title.size = Vector2(1280, 80)
	center_title.add_theme_font_size_override("font_size", 64)
	center_title.add_theme_color_override("font_color", Color(0.90, 0.97, 1.0))
	layer.add_child(center_title)

	center_sub = Label.new()
	center_sub.anchors_preset = Control.PRESET_CENTER
	center_sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	center_sub.position = Vector2(0, 40)
	center_sub.size = Vector2(1280, 40)
	center_sub.add_theme_font_size_override("font_size", 22)
	center_sub.add_theme_color_override("font_color", Color(0.55, 0.85, 0.95))
	layer.add_child(center_sub)


# --- durum geçişleri ----------------------------------------------------------
func _show_idle() -> void:
	state = State.IDLE
	center_title.text = "LUMENFALL — NEON SÜRÜŞ"
	center_sub.text = "Başlamak için BOŞLUK · yön: WASD / oklar"
	hud.text = ""


func _start() -> void:
	state = State.PLAYING
	ship_x = 0.0
	ship_y = 10.0
	speed = 34.0
	meters = 0.0
	lumen_count = 0
	drone_timer = 1.2
	lumen_timer = 0.5
	craft.visible = true
	center_title.text = ""
	center_sub.text = ""
	for d in drones:
		d["active"] = false
		d["node"].visible = false
	for l in lumens:
		l["active"] = false
		l["node"].visible = false


func _game_over() -> void:
	state = State.OVER
	var score := int(meters) + lumen_count * 25
	if score > best:
		best = score
	center_title.text = "YAKALANDIN"
	center_sub.text = "Skor: %d   ·   Rekor: %d   ·   BOŞLUK ile tekrar" % [score, best]


# --- ana döngü ----------------------------------------------------------------
func _process(delta: float) -> void:
	if Input.is_key_pressed(KEY_SPACE) or Input.is_key_pressed(KEY_ENTER):
		if state != State.PLAYING:
			_start()

	if state == State.PLAYING:
		_update_play(delta)

	_update_camera(delta)


func _update_play(delta: float) -> void:
	var level := int(meters / 400.0)
	speed = 34.0 + level * 5.0
	meters += speed * delta * 0.6

	# yönlendirme
	var lat := 30.0
	var vert := 24.0
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		ship_x -= lat * delta
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		ship_x += lat * delta
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		ship_y += vert * delta
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		ship_y -= vert * delta
	ship_x = clampf(ship_x, -AVENUE, AVENUE)
	ship_y = clampf(ship_y, 4.0, 70.0)

	craft.position = Vector3(ship_x, ship_y, 6)
	craft.rotation.z = -ship_x * 0.02

	# şehri kameraya doğru kaydır + geri dönüştür
	for b in buildings:
		b["z"] += speed * delta
		if b["z"] > 40.0:
			b["z"] -= CORRIDOR
			_randomize_building(b)
		_place_building(b)

	# spawn
	drone_timer -= delta
	if drone_timer <= 0.0:
		drone_timer = maxf(0.5, 1.5 - level * 0.08)
		_spawn(drones)
	lumen_timer -= delta
	if lumen_timer <= 0.0:
		lumen_timer = randf_range(0.6, 1.1)
		_spawn(lumens)

	# hareket + çarpışma
	for d in drones:
		if not d["active"]:
			continue
		d["z"] += speed * delta
		d["node"].position = Vector3(d["x"], d["y"], d["z"])
		d["node"].rotate_y(delta * 2.0)
		if d["z"] > 30.0:
			d["active"] = false
			d["node"].visible = false
		elif absf(d["z"] - 6.0) < 3.5:
			var dx: float = d["x"] - ship_x
			var dy: float = d["y"] - ship_y
			if dx * dx + dy * dy < 9.0:
				_game_over()

	for l in lumens:
		if not l["active"]:
			continue
		l["z"] += speed * delta
		l["node"].position = Vector3(l["x"], l["y"], l["z"])
		l["node"].rotate_z(delta * 3.0)
		if l["z"] > 30.0:
			l["active"] = false
			l["node"].visible = false
		elif absf(l["z"] - 6.0) < 4.0:
			var dx: float = l["x"] - ship_x
			var dy: float = l["y"] - ship_y
			if dx * dx + dy * dy < 12.0:
				l["active"] = false
				l["node"].visible = false
				lumen_count += 1

	var threat := int(min(100.0, meters / 26.0))
	hud.text = "MESAFE  %dm      LÜMEN  %d      PANOPT  %%%d" % [int(meters), lumen_count, threat]


func _spawn(pool: Array) -> void:
	for p in pool:
		if not p["active"]:
			p["active"] = true
			p["node"].visible = true
			p["x"] = randf_range(-AVENUE, AVENUE)
			p["y"] = randf_range(6.0, 60.0)
			p["z"] = -1400.0
			p["node"].position = Vector3(p["x"], p["y"], p["z"])
			return


func _update_camera(delta: float) -> void:
	var tx := ship_x * 0.35
	var ty := ship_y * 0.4 + 8.0
	camera.position.x += (tx - camera.position.x) * min(1.0, delta * 4.0)
	camera.position.y += (ty - camera.position.y) * min(1.0, delta * 4.0)
	camera.position.z = 42.0
	camera.look_at(Vector3(ship_x * 0.5, ship_y * 0.5 + 4.0, -80.0), Vector3.UP)
