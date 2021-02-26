import { createShortId } from '@nishans/idz';
import { Operation } from '@nishans/operations';
import { ICollection, TSchemaUnit } from '@nishans/types';
import { NishanArg } from '../';
import Data from './Data';

/**
 * A class to represent a column schema of a collection
 * @noInheritDoc
 */

export default class SchemaUnit<T extends TSchemaUnit> extends Data<ICollection> {
	schema_id: string;

	constructor (arg: NishanArg & { schema_id: string }) {
		super({ ...arg, type: 'collection' });
		this.schema_id = arg.schema_id;
	}

	update (arg: T) {
		const data = this.getCachedData();
		data.schema[this.schema_id] = { ...data.schema[this.schema_id], ...arg };
		this.Operations.pushToStack(
			Operation.collection.update(this.id, [], { schema: JSON.parse(JSON.stringify(data.schema)) })
		);
		this.logger && this.logger('UPDATE', 'collection', this.id);
	}

	delete () {
		const data = this.getCachedData();
		const schema_unit = data.schema[this.schema_id];
		if (schema_unit.type !== 'title') {
			delete data.schema[this.schema_id];
			this.Operations.pushToStack(
				Operation.collection.update(this.id, [], { schema: JSON.parse(JSON.stringify(data.schema)) })
			);
			this.logger && this.logger('DELETE', 'collection', this.id);
		}
	}

	duplicate () {
		const data = this.getCachedData(),
			id = createShortId();
		const schema_unit = data.schema[this.schema_id];
		if (schema_unit.type !== 'title') {
			data.schema[id] = data.schema[this.schema_id];
			this.Operations.pushToStack(
				Operation.collection.update(this.id, [], { schema: JSON.parse(JSON.stringify(data.schema)) })
			);
			this.logger && this.logger('UPDATE', 'collection', id);
		}
	}

	getCachedChildData () {
		const data = this.getCachedData();
		return data.schema[this.schema_id];
	}
}
