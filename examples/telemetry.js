var
	Aerogel = require('../index')
	;

var driver = new Aerogel.CrazyDriver();
var copter = new Aerogel.Copter(driver);
process.on('SIGINT', copter.land.bind(copter));

console.log('telemetry logging...');


function shutItDown()
{
	console.log('shutting down');
	copter.shutdown()
	.then(function(response)
	{
		console.log('shutting down:', response);
		process.exit(0);
	})
	.fail(function(err)
	{
		console.log('error: ', err);
		copter.shutdown()
		.then(function(response)
		{
			process.exit(1);
		});
	})
	.done();
}

function flyAndLog()
{
	copter.takeoff()
	.then(function() { return copter.land(); })
	.then(function() { return copter.shutdown(); })
	.then(function(response)
	{
		console.log(response);
		process.exit(0);
	})
	.fail(function(err)
	{
		console.log(err);
		copter.shutdown()
		.then(function(response)
		{
			console.log(response);
			process.exit(1);
		});
	})
	.done();

}

copter.on('ready', function()
{
	setTimeout(shutItDown, 20000);
});

driver.findCopters()
.then(function(copters)
{
	if (copters.length === 0)
	{
		console.error('No copters found! Is your copter turned on?');
		process.exit(1);
	}

	var uri = copters[0];
	console.log('Using copter at', uri);
	return uri;
})
.then(function(uri)
{
	return copter.connect(uri);
})
.done();


