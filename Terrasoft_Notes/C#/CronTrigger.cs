CronTrigger

string cronExpression =  "0 1 0 1/1  ? ";
var jobName = "UsrSendingGreetings";
var jobGroupName = "TriggersGroup";
AppScheduler.RemoveJob(jobName, jobGroupName);

var timeZoneCode = "FLE Standard Time";
var timeZoneInfo = TimeZoneInfo.Utc;
timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZoneCode);
var cronTrigger = new CronTriggerImpl();
cronTrigger.TimeZone = timeZoneInfo;
cronTrigger.CronExpressionString = cronExpression;
var trigger = cronTrigger;

var triggerName = "UsrSendingGreetings";
var triggerGroup = "TriggersGroup";
var processName = "UsrSendingGreetings";
var userName = "Supervisor";
string workspaceName = "Default";
var job = AppScheduler.CreateProcessJob(jobName, jobGroupName, processName, workspaceName, userName);

trigger.Name = triggerName;
trigger.Group = triggerGroup;
trigger.JobName = jobName;
trigger.JobGroup = jobGroupName;
AppScheduler.Instance.ScheduleJob(job, trigger);
return true;

Terrasoft.Core.Scheduler
Quartz  с псевдонимом Quartz
Quartz.Impl.Triggers

