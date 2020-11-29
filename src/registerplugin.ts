import { IHistory } from './schemas/history';

export function registerPlugin() {
  let data: IHistory = {
    user: "aaa",
    timestamp: new Date()
  }
  console.log(`IHistory = ${JSON.stringify(data)}`);
}
