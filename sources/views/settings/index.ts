import {JetView} from "webix-jet";

interface ISettingsView extends JetView {};

export default class SettingsView extends JetView implements ISettingsView {
	config(): any {
		return {
			template: "Settings"
		};
	}
}
