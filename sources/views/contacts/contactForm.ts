import {JetView} from "webix-jet";

import * as userIcon from "../../assets/icons/icon-user.jpg";
import contactsCollection from "../../models/contacts";
import statusesCollection from "../../models/statuses";
import IContactData from "../../utils/interfaces/contactDataInterface";
import ILoadFile from "../../utils/interfaces/loadFileInterface";

interface ITextView {
    view: string;
	label: string;
	name: string;
}

interface IUserPhoto {
	Photo: string;
}

interface IExtendedTemplate extends webix.ui.template {
	getValues(): IUserPhoto
}

interface IContactForm extends JetView {
    setFormValues(): void;
    setFormMode(mode: string): void;
    toggleUpdateOrSaveContact(): void;
    toggleLoadUsersPhoto(obj: ILoadFile): void;
    toggleDeleteUsersPhoto(): void;
    toggleCancel(): void;
    clearFormValidation(): void
    formTextElement(label: string, name: string): ITextView;
}

export default class ContactForm extends JetView implements IContactForm{
    private form: webix.ui.form;
    private usersPhoto: IExtendedTemplate;
    private _editMode: string;

	config(): any {
		const _ = this.app.getService("locale")._;

		const formLabel = {
			view: "label",
			localId: "contact-form_label",
			css: "label__form-label"
		};

		const formFirstColumn = {
			margin: 10,
			rows: [
				{
					...this.formTextElement(_("First name"), "FirstName"),
					required: true
				},
				{
					...this.formTextElement(_("Last name"), "LastName"),
					required: true
				},
				{
					view: "datepicker",
					label: _("Joining date"),
					name: "StartDate"
				},
				{
					view: "combo",
					label: _("Status"),
					options: statusesCollection,
					name: "StatusID",
					required: true
				},
				{
					...this.formTextElement(_("Job"), "Job"),
					required: true
				},
				{
					...this.formTextElement(_("Company"), "Company"),
					required: true
				},
				{
					...this.formTextElement(_("Website"), "Website")
				},
				{
					...this.formTextElement(_("Address"), "Address"),
					required: true,
					height: 65
				}
			]
		};

		const formSecondColumn = {
			margin: 10,
			rows: [
				{
					...this.formTextElement(_("Email"), "Email"),
					required: true
				},
				{
					...this.formTextElement(_("Skype"), "Skype"),
					required: true
				},
				{
					...this.formTextElement(_("Phone"), "Phone")
				},
				{
					view: "datepicker",
					label: _("Birthday"),
					name: "Birthday",
					required: true
				},
				{
					cols: [
						{
							template: (obj: IContactData) => {
								const defaultUsersPhoto = userIcon;

								return `
								<div class="contact-form__photo">
									<img 
										src=${obj.Photo || defaultUsersPhoto}
										class="contact-form__image"
										alt="contact-image">
								</div>`;
							},
							localId: "users_photo",
							css: "template__form-photo",
							borderless: true
						},
						{
							type: "clean",
							margin: 10,
							rows: [
								{ },
								{
									view: "uploader",
									label: _("Change photo"),
									css: "webix_transparent button--border",
									autosend: false,
									accept: "image/png, image/jpeg",
									on: {
										onBeforeFileAdd: (obj: ILoadFile) => this.toggleLoadUsersPhoto(obj)
									}
								},
								{
									view: "button",
									label: _("Delete photo"),
									css: "webix_transparent button--border",
									click: () => this.toggleDeleteUsersPhoto()
								}
							]
						}
					]
				}
			]
		};

		const formActionButtons = [
			{
				view: "button",
				label: _("Cancel"),
				css: "button--border",
				width: 150,
				click: () => this.toggleCancel()
			},
			{
				view: "button",
				localId: "form_button-save",
				css: "webix_primary button--border",
				width: 150,
				click: () => this.toggleUpdateOrSaveContact()
			}
		];

		return {
			view: "form",
			localId: "contact_form",
			elementsConfig: {
				labelWidth: 130,
				on: {
					onFocus: () => {
						const name = this.config.name;

						if (name) {
							this.clearFormValidation();
						}
					}
				}
			},
			rows: [
				formLabel,
				{
					gravity: 0.1
				},
				{
					cols: [
						formFirstColumn,
						{
							gravity: 0.1
						},
						formSecondColumn
					]
				},
				{ },
				{
					margin: 20,
					cols: [
						{ },
						...formActionButtons
					]
				}
			],
			rules: {
				FirstName: webix.rules.isNotEmpty,
				LastName: webix.rules.isNotEmpty,
				StatusID: webix.rules.isNotEmpty,
				Email: webix.rules.isEmail,
				Company: webix.rules.isNotEmpty,
				Address: webix.rules.isNotEmpty,
				Birthday: webix.rules.isNotEmpty
			}
		};
	}

	init(): void {
		webix.promise.all([
			contactsCollection.waitData,
			statusesCollection.waitData
		]).then(() => {
			this.form = this.$$("contact_form") as webix.ui.form;
			this.usersPhoto = this.$$("users_photo") as IExtendedTemplate;
		});
	}

	urlChange(): void {
		this.setFormValues();
	}

	setFormValues(): void {
		const contactId = this.getParam("contactId", true);

		if (contactId) {
			const item = contactsCollection.getItem(contactId);
			

			this.setFormMode("save");
			this.form.setValues(item);
			this.usersPhoto.setValues({Photo: item.Photo});
		}
		else {
			this.form.clear();
			this.toggleDeleteUsersPhoto();
			this.setFormMode("add");
		}
	}

	setFormMode(mode: string): void{
		const _ = this.app.getService("locale")._;
		const activeButton = this.$$("form_button-save") as webix.ui.button;
		const activeButtonLabel = mode === "add" ? _("Add") : _("Save");
		const formLabel = this.$$("contact-form_label") as webix.ui.label;
		const formLabelValue = mode === "add" ? _("Add new contact") : _("Edit contact");

		this._editMode = mode;
		activeButton.define("label", activeButtonLabel);
		activeButton.refresh();
		formLabel.define("label", formLabelValue);
		formLabel.refresh();
	}

	toggleUpdateOrSaveContact(): void {
		const _ = this.app.getService("locale")._;

		if (this.form.validate()) {
			const values: IContactData = this.form.getValues();
			const dateFormat: webix.WebixCallback = webix.Date.dateToStr("%Y-%m-%d %H:%i", false);

			values.Photo = this.usersPhoto.getValues().Photo;
			values.Birthday = dateFormat(values.Birthday);
			values.StartDate = values.StartDate ? dateFormat(values.StartDate) : dateFormat(new Date());

			if (this._editMode === "add") {
				contactsCollection.waitSave(() => contactsCollection.add(values))
					.then((obj: IContactData) => {
						this.app.callEvent("contactForm:close", [obj.id]);
					});
				webix.message(_("Added new contact!"));
			}
			else {
				contactsCollection.updateItem(values.id, values);
				webix.message(_("Contact was updated!"));
				this.app.callEvent("contactForm:close", [values.id]);
			}

			this.form.clear();
		}
	}

	toggleLoadUsersPhoto(obj: ILoadFile): void {
		const reader = new FileReader();
		
		reader.readAsDataURL(obj.file);
		reader.onloadend = () => {
			this.usersPhoto.setValues({Photo: reader.result});
		};
	}

	toggleDeleteUsersPhoto(): void {
		this.usersPhoto.setValues({Photo: ""});
	}

	toggleCancel(): void {
		const contactId = this.getParam("contactId", true);

		this.form.clear();
		if (contactId) this.app.callEvent("contactForm:close", [contactId]);
		else this.app.callEvent("contactForm:close", []);
	}

	clearFormValidation(): void {
		this.form.clearValidation();
	}

	formTextElement(label: string, name: string): ITextView {
		return {
			view: "text",
			label,
			name
		};
	}
}
