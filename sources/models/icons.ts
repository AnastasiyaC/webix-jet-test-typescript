import IIconsData from "../utils/interfaces/iconsDataInterface";

const icons: IIconsData[] = [
	{
		id: "flag",
		Icon: "flag"
	},
	{
		id: "comment",
		Icon: "comment"
	},
	{
		id: "clock",
		Icon: "clock"
	},
	{
		id: "phone",
		Icon: "phone"
	},
	{
		id: "skype",
		Icon: "skype"
	},
	{
		id: "fileVideo",
		Icon: "file-video"
	},
	{
		id: "sync",
		Icon: "sync"
	},
	{
		id: "coffee",
		Icon: "coffee"
	},
	{
		id: "account",
		Icon: "account"
	}
];

const iconsCollection = new webix.DataCollection({
	data: icons
});

export default iconsCollection;
