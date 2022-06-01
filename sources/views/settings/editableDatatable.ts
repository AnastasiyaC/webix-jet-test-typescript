import {IJetApp, JetView} from "webix-jet";

import iconsCollection from "../../models/icons";
import IDatatableViewItemId from "../../utils/interfaces/datatableViewItemIdInterface";

interface IEditableDatatableData {
    id: number;
	Icon: string;
	Value: string;
	value?: string;
}

interface IEditableDatatable extends JetView {
    addToDatatable(): void;
    deleteDatatableItem(id: IDatatableViewItemId): void;
    clearFormValidation(): void
};

export default class EditableDatatable extends JetView implements IEditableDatatable {
    private datatable: webix.ui.datatable;
    private form: webix.ui.form;
    private _dataCollection: webix.DataCollection;

	constructor(app: IJetApp, data: webix.DataCollection, config = {}) {
		super(app, config);
		this._dataCollection = data;
	}

	config(): any {
		const _ = this.app.getService("locale")._;

		const form = {
			view: "form",
			localId: "form_update-datatable",
			elementsConfig: {
				margin: 20,
				labelWidth: "auto",
				on: {
					onFocus: () => this.clearFormValidation()
				}
			},
			cols: [
				{
					view: "text",
					label: _("Value"),
					name: "Value"
				},
				{
					gravity: 0.1
				},
				{
					view: "richselect",
					label: _("Icon"),
					options: {
						body: {
							data: iconsCollection,
							template: (obj: IEditableDatatableData) => `<span class="webix_icon mdi mdi-${obj.Icon}"></span>`
						}
					},
					name: "Icon"
				},
				{
					gravity: 0.1
				},
				{
					rows: [
						{
							view: "button",
							label: _("Add"),
							type: "icon",
							icon: "wxi-plus-square",
							css: "webix_transparent button--border",
							width: 200,
							click: () => {
								this.addToDatatable();
							}
						}
					]
				}
			],
			rules: {
				Value: webix.rules.isNotEmpty,
				Icon: webix.rules.isNotEmpty
			}
		};

		const datatable = {
			view: "datatable",
			localId: "settings_datatable",
			editable: true,
			editaction: "dblclick",
			scrollX: false,
			select: true,
			columns: [
				{
					id: "Value",
					header: _("Value"),
					editor: "text",
					width: 300
				},
				{
					id: "Icon",
					header: _("Icon"),
					editor: "richselect",
					suggest: {
						body: {
							template: (obj: IEditableDatatableData) => `<span class="webix_icon mdi mdi-${obj.Icon}"></span>`
						}
					},
					options: iconsCollection,
					template: (obj: IEditableDatatableData) => `<span class="webix_icon mdi mdi-${obj.Icon}"></span>`,
					fillspace: true
				},
				{
					id: "Delete",
					header: "",
					template: "{common.trashIcon()}",
					width: 50
				}
			],
			onClick: {
				"wxi-trash": (e: Event, id: IDatatableViewItemId) => {
					this.deleteDatatableItem(id);
				}
			},
			rules: {
				Value: webix.rules.isNotEmpty,
				Icon: webix.rules.isNotEmpty
			}
		};

		return {
			rows: [
				form,
				datatable
			]
		};
	}

	init(): void {
		this.datatable = this.$$("settings_datatable") as webix.ui.datatable;
        this.form = this.$$("form_update-datatable") as webix.ui.form;

		this._dataCollection.waitData.then(() => this.datatable.sync(this._dataCollection, null, false));
	}

	addToDatatable(): void {
		const _ = this.app.getService("locale")._;

		if (this.form.validate()) {
			const values: IEditableDatatableData = this.form.getValues();

			this._dataCollection.add(values);
			this.form.clear();
			webix.message(_("Datatable was updated!"));
		}
		else {
			webix.message(_("Form is incomplete. Fill the form!"));
		}
	}

	deleteDatatableItem(id: IDatatableViewItemId): void {
		const _ = this.app.getService("locale")._;

		webix.confirm({
			title: _("Delete..."),
			text: _("Do you still want delete this line?"),
			ok: _("Yes"),
			cancel: _("No")
		}).then(() => {
			this._dataCollection.remove(id.row);
		});
	}

	clearFormValidation(): void {
		this.form.clearValidation();
	}
}
