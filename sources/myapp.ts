import {EmptyRouter, HashRouter, JetApp, plugins} from "webix-jet";
import "./styles/app.css";

declare const APPNAME;
declare const VERSION;
declare const BUILD_AS_MODULE;

export default class MyApp extends JetApp{
	constructor(config = {}){
		const defaults = {
			id 		: APPNAME,
			version : VERSION,
			router	: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug 	: true,
			start 	: "/top/contacts"
		};

		super({ ...defaults, ...config });

		this.attachEvent("app:error:resolve", () => {
			webix.delay(() => this.app.show("/top/contacts"));
		});
	}
}

if (!BUILD_AS_MODULE) {
	webix.ready(() => {
		const app = new MyApp();
		app.use(plugins.Locale, {
			webix: {
				en: "en-US",
				ru: "ru-RU"
			}});
		app.render();
	});
}