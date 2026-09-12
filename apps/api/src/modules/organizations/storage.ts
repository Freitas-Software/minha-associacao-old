import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export interface StoredObject {
	objectKey: string;
	publicUrl: string;
	checksumSha256: string;
}
export interface ObjectStorage {
	put(input: { key: string; content: Buffer; contentType: string }): Promise<StoredObject>;
}

export class LocalObjectStorage implements ObjectStorage {
	constructor(private readonly root = path.resolve('var/storage')) {}
	async put(input: { key: string; content: Buffer; contentType: string }): Promise<StoredObject> {
		const checksumSha256 = createHash('sha256').update(input.content).digest('hex');
		const filePath = path.resolve(this.root, input.key);
		if (!filePath.startsWith(path.resolve(this.root) + path.sep))
			throw new Error('Invalid storage key');
		await mkdir(path.dirname(filePath), { recursive: true });
		await writeFile(filePath, input.content, { flag: 'wx' });
		return { objectKey: input.key, publicUrl: `/storage/${input.key}`, checksumSha256 };
	}
}

export function createObjectStorage(): ObjectStorage {
	// S3-compatible storage can replace this factory without changing routes/domain code.
	return new LocalObjectStorage();
}
