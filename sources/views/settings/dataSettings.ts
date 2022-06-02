import {JetView} from "webix-jet";

import activityTypesCollection from "../../models/activityTypes";
import statusesCollection from "../../models/statuses";
import EditableDatatable from "./editableDatatable";

interface IDataSettings extends JetView {};

export default class DataSettings extends JetView implements IDataSettings {
	config(): any {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					view: "tabbar",
					value: "Activities",
					multiview: true,
					options: [
						{
							id: "Activities",
							value: _("Activity types")
						},
						{
							id: "Statuses",
							value: _("Contact statuses")
						}
					]
				},
				{
					cells: [
						{
							id: "Activities",
							rows: [
								new EditableDatatable(this.app, activityTypesCollection)
							]
						},
						{
							id: "Statuses",
							rows: [
								new EditableDatatable(this.app, statusesCollection)
							]
						}
					]
				}
			]
		};
	}
}
