import {JetView} from "webix-jet";

import * as userIcon from "../../assets/icons/icon-user.jpg";
import contactsCollection from "../../models/contacts";
import statusesCollection from "../../models/statuses";
import IContactData from "../../utils/interfaces/contactDataInterface";

interface IcontactsList extends JetView {
    toggleOpenAddContactForm(): void;
    filterList(): boolean
}

export default class ContactsList extends JetView implements IcontactsList {
    private list: webix.ui.list;
    private listFilter: webix.ui.text;

	config(): any {
		const _ = this.app.getService("locale")._;

		const list = {
			view: "list",
			localId: "contacts_list",
			css: "list-contact",
			type: {
				height: 60
			},
			template: (obj: IContactData) => `
					<img 
						src=${obj.Photo || userIcon}
						class="contact__image"
						alt="contact-image"
						height="50px"
						width="50px"
					>
					<span class="contact__name">
						<b>
							${obj.FirstName} ${obj.LastName}
						</b>
						<br>
						${obj.Company}
					</span>`,
			select: true,
			width: 300
		};

		const listFilter = {
			view: "text",
			localId: "contact_filter",
			placeholder: _("Type to find matching contacts"),
			height: 60
		};

		const listAddContactButton = {
			view: "button",
			label: _("Add contact"),
			type: "icon",
			icon: "wxi-plus",
			css: "webix_transparent button--border",
			padding: 20,
			margin: 20,
			click: () => this.toggleOpenAddContactForm()
		};

		return {
			type: "clean",
			rows: [
				listFilter,
				list,
				listAddContactButton
			]
		};
	}

	init(): void {
		this.list = this.$$("contacts_list") as webix.ui.list;
		this.listFilter = this.$$("contact_filter") as webix.ui.text;

		contactsCollection.waitData.then(() => {
			this.list.sync(contactsCollection, null, false);

			const listFirstId = this.list.getFirstId();

			if (!listFirstId) {
            this.app.callEvent("contactInfo:open", []);
				return;
			}

			this.list.select(String(listFirstId), false);
		});

		this.on(this.list, "onAfterSelect", (id: string) => {
			this.app.callEvent("contactInfo:open", [id]);
			this.listFilter.enable();
		});
		this.on(contactsCollection.data, "onAfterDelete", () => this.list.select(String(this.list.getFirstId()), false));
		this.on(this.listFilter, "onTimedKeyPress", () => {
			this.filterList();
			if (!this.list.getFirstId()) this.show("./contacts.contactInfo");
			this.list.select(String(this.list.getFirstId()), false);
		});
		this.on(this.app, "contactInfo:open", () => this.list.unselectAll());
		this.on(this.app, "contactForm:open", () => this.listFilter.disable());
		this.on(this.app, "contactForm:close", (id: string) => {
			if (this.list.isSelected(id)) this.app.callEvent("contactInfo:open", [id]);
			else this.list.select(id || String(this.list.getFirstId()), false);
			this.filterList();
			this.listFilter.enable();
		});
	}

	toggleOpenAddContactForm(): void {
		this.app.callEvent("contactForm:open", []);
		this.list.unselectAll();
	}

	filterList(): boolean {
		const value: string = this.listFilter.getValue().toLowerCase();
		const firstChar = value[0];

		if (!value) {
			this.list.filter("");
			return;
		}
		this.list.filter((obj: IContactData) => {
			const status = statusesCollection.getItem(obj.StatusID);
			const statusValue = status ? status.Value : "";
			const filteringFields = [
				obj.value, obj.Job, obj.Company, obj.Address, obj.Email, obj.Skype, statusValue
			];
			let filter = filteringFields.join("|");

			if (firstChar === "=" || firstChar === ">" || firstChar === "<") {
				const seachYearValue = value.slice(1);
				const startDate = obj.StartDate.getFullYear();
				const birthday = obj.Birthday.getFullYear();

				if (Number(seachYearValue)) {
					const textLength = seachYearValue.length;
					const startDateString = String(startDate).slice(0, textLength);
					const birthdayString = String(birthday).slice(0, textLength);

					if (firstChar === "=") {
						return startDateString === seachYearValue || birthdayString === seachYearValue;
					}
					if (firstChar === ">") {
						return startDateString > seachYearValue || birthdayString > seachYearValue;
					}
					if (firstChar === "<") {
						return startDateString < seachYearValue || birthdayString < seachYearValue;
					}
				}
				else {
					return false;
				}
				return true;
			}

			filter = filter.toString().toLowerCase();
			return (filter.indexOf(value) !== -1);
		});
	}
}
