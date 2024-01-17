using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
	services = [
		(name = "main", worker = .main),
		(name = "kv", disk = ( path = "kv", writable = true, allowDotfiles = false ) )
	],

	sockets = [
		# Serve on :8000
		( name = "http",
			address = "*:8000",
			http = (),
			service = "main"
		),
	]
);

const main :Workerd.Worker = (
	compatibilityDate = "2023-12-01",

	modules = [
		( name = "dist/worker.mjs", esModule = embed "dist/worker.mjs" ),
	],
	bindings = [
		( name = "kv", kvNamespace = ( name = "kv" ) ),
	],
);
