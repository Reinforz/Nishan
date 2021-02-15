import { Operation } from '@nishans/operations';
import { TSchemaUnit, ICollection } from '@nishans/types';
import { NishanArg } from '../types';
import { createShortId } from '../utils';
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
		const data = super.getCachedData();
		data.schema[this.schema_id] = { ...data.schema[this.schema_id], ...arg };
		this.Operations.stack.push(Operation.collection.update(this.id, [], { schema: data.schema }));
		this.logger && this.logger('UPDATE', 'collection', this.id);
	}

	delete () {
		const data = super.getCachedData();
		delete data.schema[this.schema_id];
		this.Operations.stack.push(Operation.collection.update(this.id, [], { schema: data.schema }));
		this.logger && this.logger('DELETE', 'collection', this.id);
	}

	duplicate () {
		const data = super.getCachedData(),
			id = createShortId();
		data.schema[id] = data.schema[this.schema_id];
		this.Operations.stack.push(Operation.collection.update(this.id, [], { schema: data.schema }));
		this.logger && this.logger('CREATE', 'collection', id);
	}

	getCachedChildData () {
		const data = super.getCachedData();
		return data.schema[this.schema_id];
	}
}
