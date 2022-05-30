import {JetView} from "webix-jet";

import ContactsList from "./contactsList";

interface IContactsView extends JetView {};

export default class ContactsView extends JetView implements IContactsView{
	config(): any {
		return {
			cols: [
				ContactsList,
				{
					$subview: true
				}
			]
		};
	}

	init(): void {
		this.on(this.app, "contactInfo:open", (id: string) => {
			if (id) this.show(`./contacts.contactInfo?contactId=${id}`);
			else this.show("./contacts.contactInfo");
		});
		this.on(this.app, "contactForm:open", (id: string) => {
			if (id) this.show(`./contacts.contactForm?contactId=${id}`);
			else this.show("./contacts.contactForm");
		});
	}
}
