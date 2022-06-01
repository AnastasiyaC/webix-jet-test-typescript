interface IFile extends Blob {
	lastModified: number
	lastModifiedDate: Date;
	name: string;
	size: number;
}

export default interface ILoadFile {
	file: IFile,
	sizetext?: string
}