import {JetView} from "webix-jet";

import ActivitiesDatatable from "../commonViews/activitiesDatatable";

interface IContactActivityDatateble extends JetView {};

export default class ContactActivityDatateble extends JetView implements IContactActivityDatateble {
	config(): any {
		return {
			rows: [new ActivitiesDatatable(this.app, "ContactID")]
		};
	}
}
