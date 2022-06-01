import {JetView} from "webix-jet";

import DataSettings from "./dataSettings";
import LanguageSettings from "./languageSettings";

interface ISettingsView extends JetView {};

export default class SettingsView extends JetView implements ISettingsView {
	config(): any {
		return {
			rows: [
				LanguageSettings,
				{
					gravity: 0.1
				},
				DataSettings
			]
		};
	}
}
