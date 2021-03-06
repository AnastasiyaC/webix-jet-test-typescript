import {IJetApp, JetView} from "webix-jet";

import activitiesCollection from "../../models/activities";
import activityTypesCollection from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";
import activitiesFilters from "../../utils/activitiesFilters";
import ActivitiesFilterTabbar from "./activitesFilterTabbar";
import ActivitiesModalWindow from "./activitiesModalWindow";
import IDatatableViewItemId from "../../utils/interfaces/datatableViewItemIdInterface";
import IActivitiesData from "../../utils/interfaces/activitiesDataInterface";
import IActivitiesModalWindow from "sources/utils/interfaces/activityModalWindowInterface";

interface IActivitiesDatatable extends JetView {
	toggleAddActivity(): void;
	toggleEditActivity(id: IDatatableViewItemId): void;
	toggleDeleteItem(id: IDatatableViewItemId): void;
	compareDates(value: Date, filter: Date): boolean;
	filterByContactName(): void;
	filterByTabFilterName(): void
};

export default class ActivitiesDatatable extends JetView implements IActivitiesDatatable {
    private _hiddenColumn: string;
    private datatable: webix.ui.datatable;
	private windowForm: IActivitiesModalWindow;
    private _tabId: string;

	constructor(app: IJetApp, hiddenColumn: string, config = {}) {
		super(app, config);
		this._hiddenColumn = hiddenColumn;
	}

	config(): any {
		const _ = this.app.getService("locale")._;

		const toolbar = {
			view: "toolbar",
			paddingX: 20,
			paddingY: 5,
			cols: [
				this._hiddenColumn ? { } : ActivitiesFilterTabbar,
				{
					view: "button",
					label: _("Add activity"),
					type: "icon",
					icon: "wxi-plus-square",
					css: "webix_transparent button--border",
					width: 220,
					click: () => this.toggleAddActivity()
				}
			]
		};

		const datatable = {
			view: "datatable",
			localId: "activities_datatable",
			editable: true,
			select: true,
			scrollX: false,
			columns: [
				{
					id: "State",
					header: "",
					template: "{common.checkbox()}",
					width: 50,
					checkValue: "Close",
					uncheckValue: "Open"
				},
				{
					id: "TypeID",
					header: [
						_("Activity type"),
						{
							content: "selectFilter"
						}
					],
					collection: activityTypesCollection,
					sort: "text",
					fillspace: true,
					template: (obj: IActivitiesData) => {
						const activityType = activityTypesCollection.getItem(obj.TypeID);
						const activityIcon = activityType ? `<span class="webix_icon mdi mdi-${activityType.Icon}"></span>` : " ";
						const activityValue = activityType ? activityType.Value : "activity not found";

						return `${activityIcon} ${activityValue}`;
					}
				},
				{
					id: "DueDate",
					format: webix.i18n.longDateFormatStr,
					header: [
						_("Due date"),
						{
							content: "datepickerFilter",
							compare: this.compareDates
						}
					],
					fillspace: true,
					sort: "date"
				},
				{
					id: "Details",
					header: [
						_("Details"),
						{content: "textFilter"}
					],
					sort: "text",
					fillspace: true
				},
				{
					id: "ContactID",
					header: [
						_("Contacts"),
						{
							content: "selectFilter"
						}
					],
					collection: contactsCollection,
					fillspace: true,
					sort: "text",
					template: (obj: IActivitiesData) => {
						const contact = contactsCollection.getItem(obj.ContactID);

						return contact ? contact.value : "contact not found";
					}
				},
				{
					id: "edit",
					header: "",
					template: "{common.editIcon()}",
					width: 50
				},
				{
					id: "delete",
					header: "",
					template: "{common.trashIcon()}",
					width: 50
				}
			],
			onClick: {
				"wxi-trash": (e: Event, id: IDatatableViewItemId) => {
					this.toggleDeleteItem(id);
				},
				"wxi-pencil": (e: Event, id: IDatatableViewItemId) => {
					this.toggleEditActivity(id);
				}
			}
		};

		const ui = {
			rows: this._hiddenColumn ? [
				datatable,
				toolbar
			] :
				[
					toolbar,
					datatable
				]
		};

		return ui;
	}

	init(): void {
		this.datatable = this.$$("activities_datatable") as webix.ui.datatable;

		if (this._hiddenColumn) {
			this.datatable.hideColumn(this._hiddenColumn);
		}

		this.windowForm = this.ui(ActivitiesModalWindow) as IActivitiesModalWindow;

		webix.promise.all([
			activitiesCollection.waitData,
			activityTypesCollection.waitData,
			contactsCollection.waitData
		]).then(() => {
			this.datatable.parse(activitiesCollection, "json");
			this.filterByContactName();

			this.on(activitiesCollection.data, "onStoreUpdated", () => {
				this.filterByContactName();
				this.filterByTabFilterName();
			});

			this.on(this.app, "filterByTabName", (tabId: string) => {
				this._tabId = tabId;
				this.datatable.filterByAll();
			});
		});
		this.on(this.datatable, "onAfterFilter", () => {
			this.filterByContactName();
			this.filterByTabFilterName();
		});
	}

	urlChange(): void {
		this.datatable.filterByAll();
		this.filterByContactName();
	}

	toggleAddActivity(): void {
		this.windowForm.showWindow("");
	}

	toggleEditActivity(id: IDatatableViewItemId): void {
		this.windowForm.showWindow(id);
	}

	toggleDeleteItem(id: IDatatableViewItemId): void {
		const _ = this.app.getService("locale")._;

		webix.confirm({
			title: _("Delete..."),
			text: _("Do you still want to delete this activity?"),
			ok: _("Yes"),
			cancel: _("No")
		}).then(() => {
			activitiesCollection.remove(id.row);
		});
	}

	compareDates(value: Date, filter: Date): boolean {
		value.setHours(0);
		value.setMinutes(0);

		return webix.Date.equal(value, filter);
	}

	filterByContactName(): void {
		const contactId = this.getParam("contactId", false);

		if (contactId) this.datatable.filter("#ContactID#", contactId, true);
	}

	filterByTabFilterName(): void {
		if (!this._hiddenColumn && this._tabId) this.datatable.filter(activitiesFilters[this._tabId], null, true);
	}
}