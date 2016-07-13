Run BuisenessProcess from JS

startProcess: function() {
     var leadID = this.getActiveRow().get("Id");
     var processArgs = {
          sysProcessName: 'UsrLeadManagment',
          parameters: {
               "UsrLeadId": leadID
          }
     };
     ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, this);
     this.hideBodyMask();
}

