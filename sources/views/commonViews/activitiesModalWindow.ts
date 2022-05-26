import {JetView} from "webix-jet";

import ActivitiesForm from "./activitiesForm";
import IDatatableViewItemId from "../../utils/interfaces";

interface IActivitiesModalWindow extends JetView{
	showWindow(id: IDatatableViewItemId | string): void;
	hideWindow(): void;
}
export default class ActivitiesModalWindow extends JetView implements IActivitiesModalWindow{
	private popupWindow: webix.ui.window;

	config(): any {
		return {
			view: "window",
			localId: "window-center",
			head: " ",
			position: "center",
			modal: true,
			body: {
				rows: [
					ActivitiesForm
				]
			}
		};
	}

	init(): void {
		this.on(this.app, "editor:close", () => {
			this.hideWindow();
		});
	}

	showWindow(id: IDatatableViewItemId | string): void {
		this.popupWindow = this.getRoot() as webix.ui.window;
		const _ = this.app.getService("locale")._;

		this.popupWindow.getHead().setHTML(id ? _("Edit activity") : _("Add activity"));

		if (id) {
			this.setParam("activityId", id, true);
		}
		this.app.callEvent("setFormValue", []);
		this.popupWindow.show();
	}

	hideWindow(): void {
		this.popupWindow.hide();
	}
}
