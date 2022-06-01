import {JetView} from "webix-jet";

import * as userIcon from "../../assets/icons/icon-user.jpg";
import activitiesCollection from "../../models/activities";
import contactsCollection from "../../models/contacts";
import filesCollection from "../../models/files";
import statusesCollection from "../../models/statuses";
import ContactData from "./contactData";
import IContactData from "../../utils/interfaces/contactDataInterface";
import IActivitiesData from "../../utils/interfaces/activitiesDataInterface";

interface IContactInfo extends JetView {
	setContactInfo(): void;
	toggleOpenEditContactForm(): void;
	toggleDeleteContact(): void;
}

export default class ContactInfo extends JetView implements IContactInfo {
	private contactName: webix.ui.template;
	private contactInfo: webix.ui.template;
	private contactInfoCell: webix.ui.baseview;
	private contactEmptyInfoCell: webix.ui.baseview;

	config(): any {
		const _ = this.app.getService("locale")._;

		const settingsButtons = {
			margin: 20,
			padding: 10,
			cols: [
				{
					view: "button",
					label: _("Delete"),
					type: "icon",
					icon: "wxi-trash",
					css: "webix_transparent button--border",
					width: 120,
					click: () => this.toggleDeleteContact()
				},
				{
					view: "button",
					label: _("Edit"),
					type: "icon",
					icon: "wxi-pencil",
					css: "webix_transparent button--border",
					width: 120,
					click: () => this.toggleOpenEditContactForm()
				}
			]
		};

		const toolbar = {
			type: "clean",
			cols: [
				{
					template: (obj: IContactData) => {
						if (Object.keys(obj).length === 0) return "";

						return `
							<span class="contact-name">
								${`${obj.FirstName} ${obj.LastName}` || "<dfn style=\"opacity: 0.5\">empty data</dfn>"}
							</span>`;
					},
					localId: "template_contact-name",
					css: "template__contact-name",
					gravity: 2
				},
				settingsButtons
			]
		};

		const contactInfoTemplate = {
			template: (obj: IContactData) => {
				const info = {
					Email: "email",
					Skype: "skype",
					Job: "tag",
					Company: "briefcase-variant",
					BirthdayDate: "calendar-month",
					Address: "map-marker-outline"
				};
				const defaultValue = "<dfn style=\"opacity: 0.5\">empty data</dfn>";
				const defaultUsersPhoto = userIcon;
				const photo = `
					<div class="contact-info__photo">
						<img 
							src=${obj.Photo || defaultUsersPhoto}
							class="contact-info__image"
							alt="contact-image">
					</div>`;
				const statusValue = statusesCollection.getItem(obj.StatusID) ?
					statusesCollection.getItem(obj.StatusID).Value : defaultValue;
				const statusIconName = statusesCollection.getItem(obj.StatusID) ?
					statusesCollection.getItem(obj.StatusID).Icon : "";
				const statusIcon = statusIconName && `<span class="webix_icon mdi mdi-${statusIconName}"></span> `;
				const status = `
					<span class="contact-info__status">
						${statusIcon + statusValue}
					</span>`;
				const infoTotal = Object.keys(info).map(el => `
					<div class="details__item">
						<span class="webix_icon mdi mdi-${info[el]}"></span>
						<span>
							${obj[el] || defaultValue}
						</span>
					</div>`);

				const infoDetails = infoTotal.join("");

				if (Object.keys(obj).length === 0) return "Contact is not selected...";

				return `
					<div class="contact-info">
						${photo}
						${status} 
						<div class="contact-info__details">
							${infoDetails}
						</div>
					</div>`;
			},
			localId: "template_contact-info",
			css: "template--grid_contact-info",
			height: 250
		};

		const contactInfo = {
			type: "clean",
			localId: "contact-info",
			rows: [
				toolbar,
				contactInfoTemplate,
				ContactData
			]
		};

		const empty = {
			template: "Contact is not selected..."
		};

		const ui = {
			cells: [
				{
					id: "contact-info",
					rows: [
						contactInfo
					]
				},
				{
					id: "empty-info",
					rows: [
						empty
					]
				}
			],
			animate: false
		};

		return ui;
	}

	init(): void {
		this.contactName = this.$$("template_contact-name") as webix.ui.template;
		this.contactInfo = this.$$("template_contact-info") as webix.ui.template;
		this.contactInfoCell = this.$$("contact-info") as webix.ui.baseview;
		this.contactEmptyInfoCell = this.$$("empty-info") as webix.ui.baseview;

		webix.promise.all([
			contactsCollection.waitData,
			statusesCollection.waitData
		]).then(() => {
			this.setContactInfo();
		});
	}

	urlChange(): void {
		this.setContactInfo();
	}

	setContactInfo(): void {
		const contactId = this.getParam("contactId", true);
		
		if (contactId) {
			const item = contactsCollection.getItem(contactId);

			this.contactName.setValues(item);
			this.contactInfo.setValues(item);
			this.contactInfoCell.show();
		}
		else {
			this.app.callEvent("contactInfo:open", []);
			this.contactEmptyInfoCell.show();
		}
	}

	toggleOpenEditContactForm(): void {
		const contactId = this.getParam("contactId", true);

		this.app.callEvent("contactForm:open", [contactId]);
	}

	toggleDeleteContact(): void {
		const contactId = this.getParam("contactId", true);
		const _ = this.app.getService("locale")._;

		webix.confirm({
			title: _("Delete..."),
			text: _("Do you still want to delete this contact?"),
			ok: _("Yes"),
			cancel: _("No")
		}).then(() => {
			if (contactId) {
				activitiesCollection.data.each((el: IActivitiesData) => {
					if (String(el.ContactID) === String(contactId)) {
						activitiesCollection.remove(el.id);
					}
				});

				filesCollection.data.each((el) => {
					if (String(el.ContactID) === String(contactId)) {
						filesCollection.remove(el.id);
					}
				});

				contactsCollection.remove(contactId);
			}
		});
	}
}
