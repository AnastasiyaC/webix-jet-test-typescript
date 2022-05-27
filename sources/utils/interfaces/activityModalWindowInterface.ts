import { JetView } from "webix-jet";
import IDatatableViewItemId from "./datatableViewItemIdInterface";

export default interface IActivitiesModalWindow extends JetView{
	showWindow(id: IDatatableViewItemId | string): void;
	hideWindow(): void;
}