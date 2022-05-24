import {JetView} from "webix-jet";

import activitiesCollection from "../../models/activities";
import activityTypesCollection from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";

interface IValues {
	id: number;
	[key: string]: any;
  }

export default class ActivitiesForm extends JetView {
	activitiesForm: webix.ui.form;
	_editMode: string;

	config() {
		const _ = this.app.getService("locale")._;

		const activitiesForm = {
			view: "form",
			localId: "activities_edit-form",
			margin: 10,
			width: 600,
			elementsConfig: {
				labelWidth: 100,
				on: {
					onFocus: () => {
						const name: string = this.config.name;

						if (name) {
							this.clearFormValidation();
						}
					}
				}
			},
			elements: [
				{
					view: "textarea",
					label: _("Details"),
					name: "Details",
					height: 120
				},
				{
					view: "combo",
					label: _("Type"),
					name: "TypeID",
					options: activityTypesCollection
				},
				{
					view: "combo",
					localId: "contact_combo",
					label: _("Contact"),
					name: "ContactID",
					options: contactsCollection
				},
				{
					cols: [
						{
							view: "datepicker",
							label: _("Date"),
							name: "Date",
							format: "%d %M %Y"
						},
						{
							view: "datepicker",
							label: _("Time"),
							name: "Time",
							format: "%H:%i",
							type: "time",
							labelAlign: "right"
						}
					]
				},
				{
					view: "checkbox",
					label: _("Completed"),
					name: "State",
					checkValue: "Close",
					uncheckValue: "Open"
				},
				{
					margin: 20,
					cols: [
						{ },
						{
							view: "button",
							localId: "form_button-save",
							css: "webix_primary button--border",
							width: 150,
							click: (): void => this.toggleUpdateOrSave()
						},
						{
							view: "button",
							value: _("Cancel"),
							css: "button--border",
							width: 150,
							click: (): void => this.toggleCloseForm()
						}
					]
				}
			],
			rules: {
				Details: webix.rules.isNotEmpty,
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty,
				Date: webix.rules.isNotEmpty,
				Time: webix.rules.isNotEmpty
			}
		};

		return activitiesForm;
	}

	init() {
		this.activitiesForm = this.$$("activities_edit-form") as webix.ui.form;

		webix.promise.all([
			activitiesCollection.waitData,
			activityTypesCollection.waitData,
			contactsCollection.waitData
		]).then(() => {
			this.on(this.app, "setFormValue", () => this.setFormValues());
		});
	}

	toggleCloseForm(): void {
		this.activitiesForm.clear();
		this.activitiesForm.clearValidation();
		this.app.callEvent("editor:close", []);
		this.showCurrentPage();
	}

	toggleUpdateOrSave(): void {
		const _ = this.app.getService("locale")._;

		if (this.activitiesForm.validate()) {
			const values = this.activitiesForm.getValues();

			const dateFormat: webix.WebixCallback = webix.Date.dateToStr("%Y-%m-%d", false);
			const date: string = dateFormat(values.Date);

			const timeFormat: webix.WebixCallback = webix.Date.dateToStr("%H:%i", false);
			const time: string = timeFormat(values.Time);

			const {id, Details, TypeID, ContactID, State} = values;
			const dataValues: IValues = {id, Details, TypeID, ContactID, State};
			dataValues.DueDate = `${date} ${time}`;


			if (this._editMode === "add") {
				activitiesCollection.add(dataValues);
				webix.message("Added new activity!");
			}else {
				activitiesCollection.updateItem(id, dataValues);
				webix.message("Activity was updated!");
			}

			this.toggleCloseForm();
		}else {
			webix.message(_("Form is incomplete. Fill the form!"));
		}
	}

	showCurrentPage(): void {
		const params = this.getUrl()[0].params;
		const contactId = params.contactId;

		if (contactId) {
			this.app.callEvent("contactInfo:open", [contactId]);
			return;
		}

		this.show("/top/activities");
	}

	setFormValues(): void {
		const params = this.getUrl()[0].params;
		const activityId = params.activityId;
		const contactId = params.contactId;
		const contactCombo = this.$$("contact_combo") as webix.ui.combo;

		if (activityId) {
			const item = activitiesCollection.getItem(activityId);
			item.Date = item.DueDate;
			item.Time = item.DueDate;

			this.setFormMode("save");
			this.activitiesForm.setValues(item);
			if (contactId) contactCombo.disable();
		}

		 {
			this.activitiesForm.clear();
			if (contactId) {
				contactCombo.setValue(contactId);
				contactCombo.disable();
			}
			this.setFormMode("add");
		}
	}

	setFormMode(mode: string): void {
		const activeButton = this.$$("form_button-save") as webix.ui.button;
		const _ = this.app.getService("locale")._;
		const activeButtonLabel = mode === "add" ? _("Add") : _("Save");

		this._editMode = mode;
		activeButton.define("label", activeButtonLabel);
		activeButton.refresh();
	}

	clearFormValidation(): void {
		this.activitiesForm.clearValidation();
	}
}
