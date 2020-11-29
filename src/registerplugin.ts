export function registerPlugin(schema, opts = {}) {

  // schema.pre(['save', 'update', 'updateOne'], function (next) {
  schema.pre(['update', 'updateOne'], function (next) {
      console.log(`PRE SAVE HOOK CALLED`);
      // if (this?.isNew)
      // {
      //     console.log('NEW COLLECTION: History must be created within create()!');
      //     next();
      // }
      //console.log(`DATA = ` + Object.keys(this.options));

      if (this.options?.__history === true &&
          this.options?.__user &&
          this.options?.__reason
      ) {
          /* Logic
          *  findById document
          *  getAll HistoryEvent for document
          *  diff between update and document?
          *  add HistoryEvent
          *  save
          */
          // console.log(`History must be updated ` + this._update.name);

          this
              .find(this._conditions)
              .cursor()
              .eachAsync(result => {
                  // console.log(`FOUND Document = ${result}`);
                  let oldVersion: number = result.history[result.history.length - 1]?.version;
                  // console.log(`oldVersion = ${oldVersion}`);
                  let newVersion: number = oldVersion ? oldVersion + 1 : 1;
                  // console.log(`newVersion = ${newVersion}`);
                  //console.log('this._update = ' + JSON.stringify(this._update.$set));

                  result.history?.push({
                      diff: {
                          previous: {name: result.name},
                          current: this._update.$set
                      },
                      user: this?.options?.__user,
                      reason: this?.options?.__reason,
                      version: newVersion
                  });

                  result.save();
              });
      }

      next();
  });
}