import { prop } from '@typegoose/typegoose';
import { modelOptions } from '@typegoose/typegoose/lib/modelOptions';
import { Severity } from '@typegoose/typegoose/lib/internal/constants';
import { HistoryEvent } from './historyevent';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class History {
    @prop({ type: HistoryEvent })
    history: HistoryEvent[];
}