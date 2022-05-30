import {JetView} from "webix-jet";

import filesCollection from "../../models/files";
import IDatatableViewItemId from "../../utils/interfaces/datatableViewItemIdInterface";
import IFilesData from "../../utils/interfaces/filesDataInterface";
import ILoadFile from "../../utils/interfaces/loadFileInterface";

interface IContactFiliesDatatable extends JetView {
    filterByContactName(id: string): void;
    toggleDeleteFile(id: IDatatableViewItemId): void;
    sortByFileSizes(a: IFilesData, b: IFilesData): number;
    saveFile(obj: ILoadFile): void;
    showErrorMessage(): void;
}

export default class ContactFiliesDatatable extends JetView implements IContactFiliesDatatable{
    private datatable: webix.ui.datatable;

	config(): any {
		const _ = this.app.getService("locale")._;

		const filiesDataTable = {
			view: "datatable",
			localId: "files_datatable",
			editable: true,
			select: true,
			scrollX: false,
			columns: [
				{
					id: "Name",
					header: _("Name"),
					sort: "text",
					fillspace: true
				},
				{
					id: "ChangeDate",
					format: webix.i18n.longDateFormatStr,
					header: _("Change date"),
					sort: "date",
					width: 200
				},
				{
					id: "SizeText",
					header: _("Size"),
					sort: this.sortByFileSizes,
					width: 100
				},
				{
					id: "delete",
					header: "",
					template: "{common.trashIcon()}",
					width: 50
				}
			],
			onClick: {
				"wxi-trash": (e: Event, id: IDatatableViewItemId) => this.toggleDeleteFile(id)
			}
		};

		const updoadButton = {
			view: "uploader",
			label: _("Upload file"),
			type: "icon",
			icon: "mdi mdi-cloud-upload",
			css: "webix_transparent button--border",
			inputWidth: 250,
			align: "center",
			autosend: false,
			on: {
				onAfterFileAdd: (obj: ILoadFile) => this.saveFile(obj),
				onFileUploadError: () => this.showErrorMessage()
			}
		};

		return {
			rows: [
				filiesDataTable,
				updoadButton
			]
		};
	}

	init(): void {
		this.datatable = this.$$("files_datatable") as webix.ui.datatable;
		const contactId = this.getParam("contactId", false);

		this.datatable.sync(filesCollection, null, false);
		this.filterByContactName(contactId);
	}

	urlChange(): void {
		const contactId = this.getParam("contactId", false);

		this.filterByContactName(contactId);
	}

	filterByContactName(id: string): void {
		filesCollection.filter(obj => obj.ContactID === id);
	}

	toggleDeleteFile(id: IDatatableViewItemId): void {
		const _ = this.app.getService("locale")._;

		webix.confirm({
			title: _("Delete..."),
			text: _("Do you still want to delete this file?"),
			ok: _("Yes"),
			cancel: _("No")
		}).then(() => {
			filesCollection.remove(id.row);
		});
	}

	sortByFileSizes(a: IFilesData, b: IFilesData): number {
		return a.Size >= b.Size ? 1 : -1;
	}

	saveFile(obj: ILoadFile): void {
		const contactId = this.getParam("contactId", false);

		const savedFile: IFilesData = {
			ContactID: contactId,
			Name: obj.file.name,
			ChangeDate: obj.file.lastModifiedDate,
			Size: obj.file.size,
			SizeText: obj.sizetext
		};

		filesCollection.add(savedFile);
	}

	showErrorMessage(): void {
		const _ = this.app.getService("locale")._;

		webix.message(_("Error during file upload..."));
	}
}
