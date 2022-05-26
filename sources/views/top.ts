import {JetView, plugins} from "webix-jet";

interface INameData {
	name: string;
}

interface ITopView extends JetView {};

export default class TopView extends JetView implements ITopView {
	config(): any {
		const _ = this.app.getService("locale")._;

		const header = {
			type: "header",
			localId: "page_header",
			template: (obj: INameData) => `<span class="template-header">${obj.name}</span>`,
			css: "webix_header app_header"
		};

		const menu = {
			view: "menu",
			id: "top:menu",
			localId: "page_menu",
			css: "app_menu",
			width: 200,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{
					icon: "wxi-user",
					value: _("Contacts"),
					id: "contacts"
				},
				{
					icon: "wxi-calendar",
					value: _("Activities"),
					id: "activities"
				},
				{
					icon: "wxi-columns",
					value: _("Settings"),
					id: "settings"}
			]
		};

		const ui = {
			css: "app_layout",
			rows: [
				header,
				{
					cols: [
						menu,
						{
							$subview: true
						}
					]
				}
			]
		};

		return ui;
	}

	init(): void {
		this.use(plugins.Menu, "top:menu");

		const header = this.$$("page_header") as webix.ui.template;
		const menu = this.$$("page_menu") as webix.ui.contextmenu;

		this.on(menu, "onAfterSelect", () => {
			const name = menu.getSelectedItem(false).value;
			header.setValues({name});
		});
	}
}