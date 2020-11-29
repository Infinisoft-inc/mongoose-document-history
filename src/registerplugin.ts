const pick = require('lodash.pick');

export function registerPlugin(schema, opts = {}) {

  schema.pre(['update', 'updateOne'], function (next) {

      if (this.options?.__history === true &&
          this.options?.__user &&
          this.options?.__reason
      ) {
          this
              .find(this._conditions)
              .cursor()
              .eachAsync(result => {
                  let oldVersion: number = result.history[result.history.length - 1]?.version;
                  let newVersion: number = oldVersion ? oldVersion + 1 : 1;

                  result.history?.push({
                      diff: {
                          previous: pick(result, Object.keys(this._update.$set)),
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