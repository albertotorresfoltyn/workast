export default {
	"port": 8081,
	"bodyLimit": "500mb",
	"corsHeaders": ["Link"],
	"connection": {
		"mongo": {
			"port": '27019',
			"dbName": "workast",
			"dbpath": "./"
		}
	}
}