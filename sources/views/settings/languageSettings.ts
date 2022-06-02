import {JetView} from "webix-jet";

interface ILanguageSettings extends JetView {
    toggleChangeLanguage(): void
};

export default class LanguageSettings extends JetView implements ILanguageSettings {
    private segmented: webix.ui.segmented;

	config(): any {
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();

		return {
			view: "segmented",
			localId: "language_settings",
			value: lang,
			label: _("Language"),
			options: [
				{
					id: "en",
					value: _("English")
				},
				{
					id: "ru",
					value: _("Russian")
				}
			],
			click: () => this.toggleChangeLanguage()
		};
	}

	toggleChangeLanguage(): void {
		const langs = this.app.getService("locale");
        this.segmented = this.$$("language_settings") as webix.ui.segmented;
		const value = this.segmented.getValue();

		langs.setLang(value);
	}
}
