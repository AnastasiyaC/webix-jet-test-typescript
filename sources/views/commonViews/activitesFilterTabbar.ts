import {JetView} from "webix-jet";

interface IActivitiesFilterTabbar extends JetView {};

export default class ActivitiesFilterTabbar extends JetView implements IActivitiesFilterTabbar{
	private tabbar: webix.ui.tabbar;

	config(): any {
		const _ = this.app.getService("locale")._;

		const filterTabbar = {
			view: "tabbar",
			localId: "activities_tabbar",
			value: "All",
			options: [
				{
					id: "All",
					value: _("All")
				},
				{
					id: "Overdue",
					value: _("Overdue")
				},
				{
					id: "Completed",
					value: _("Completed")
				},
				{
					id: "Today",
					value: _("Today")
				},
				{
					id: "Tomorrow",
					value: _("Tomorrow")
				},
				{
					id: "ThisWeek",
					value: _("This week")
				},
				{
					id: "ThisMonth",
					value: _("This month")
				}
			]
		};

		return filterTabbar;
	}

	init(): void {
		this.tabbar = this.$$("activities_tabbar") as webix.ui.tabbar;

		this.on(this.tabbar, "onAfterTabClick", (tabId: string) => this.app.callEvent("filterByTabName", [tabId]));
	}
}