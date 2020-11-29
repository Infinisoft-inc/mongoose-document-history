import { prop } from '@typegoose/typegoose';
import { modelOptions } from '@typegoose/typegoose/lib/modelOptions';
import { Severity } from '@typegoose/typegoose/lib/internal/constants';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class HistoryEvent {
    @prop({ _id: false })
    diff?: {
        previous: {},
        current: {}
    };
    //@prop(ref: User)
    //user: mongoose.Types.ObjectId;
    @prop()
    user: string;
    @prop()
    reason: string;
    @prop({default: 0})
    version?: number;
    @prop({ default: Date.now })
    timestamp?: Date;
}