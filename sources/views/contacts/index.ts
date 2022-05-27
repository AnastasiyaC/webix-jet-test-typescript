import {JetView} from "webix-jet";

interface IContactsView extends JetView {};

export default class ContactsView extends JetView implements IContactsView{
	config(): any {
		return {
			template: "Contacts"
		};
	}
}
