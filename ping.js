require('dotenv').config();

const axios = require('axios');
const CancelToken = axios.CancelToken;
const JSONdb = require('simple-json-db');
const db = new JSONdb(process.env.db || './db.json');

function ping(url){
	const source = CancelToken.source();
	setTimeout(() => source.cancel(url), parseInt(process.env.timeout) || 2000);
	return axios.head(url, {cancelToken: source.token})
		.then(({status, statusText}) => ({url, status, statusText}));
}

function saveRecod(e){
	console.log('saveRecod', e.url);
	return new Promise((res, rej) => {
		let timestamp = (new Date()).toISOString();
		e.timestamp = timestamp;

		let record = db.get(e.url) || [];
		record.push(e);
		
		db.set(e.url, record);
		res(e);
	})
}

function timeout(k){
	// I don't know why node throw an error here, but it actually work.
	//
	//	error TypeError: Cannot read property 'method' of undefined
	//		at timeout (/home/simba/git/uptime-robot/ping.js:30:25)
	//		at runNextTicks (internal/process/task_queues.js:62:5)
	//		at listOnTimeout (internal/timers.js:518:9)
	//		at processTimers (internal/timers.js:492:7)
	//		at async Promise.all (index 2)
	let url = k.message;
	console.log('timeout', url);
	return new Promise((res, rej) => {
		let timestamp = (new Date()).toISOString();
		let e = {
			url: url,
			status: 408,
			statusText: 'Request Timeout test',
			timestamp
		}

		let record = db.get(e.url) || [];
		record.push(e);
		
		db.set(e.url, record);
		res(e);
	})
}

function pingAndSave(url){
	return ping(url).then(saveRecod).catch(timeout);
}

module.exports = {
	pingAndSave,
	saveRecod,
	ping
}
