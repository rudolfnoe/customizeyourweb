with(customizeyourweb){
(function(){
   /*
    * Converted the single config file to seperate config files for each script
    */
   var ConfigDataConverter = {

      convertToSeperateConfigFiles: function(){
         try{
            var scripts = this.getScriptsFromOldConfigFile()
            if(scripts!=null){
               //From migration to 0_1Build20090506
               this.resetIds(scripts)
               this.writeScripts(scripts)
            }
            this.renameOldConfigFile()
         }catch(e){
            alert(e.message + "\n" + e.stack)
            throw e
         }
      },
      
      getConfigFile: function(){
         var configFile = CywConfig.getConfigDir()
         configFile.append("customizeyourweb_config.xml")
         if(!configFile.exists()){
            throw new Error("Config conversion started even no config file is there")
         }
         return configFile;
      },
      
      getScriptsFromOldConfigFile: function(){
         var configFile = this.getConfigFile();
         var configContent =  FileIO.read(configFile)
         if(configContent.length==0)
            return null
         return JSerial.deserialize(configContent)
      },
      
      renameOldConfigFile: function(){
         var configFile = this.getConfigFile()
         configFile.moveTo(CywConfig.getConfigDir(), configFile.leafName + ".bak")
      },
      
      resetIds : function(scripts) {
			for (var i = 0; i < scripts.size(); i++) {
				scripts.get(i).id = i + 1
			}
		},

      writeScripts: function(scripts){
         for(var i=0; i<scripts.size(); i++){
            CywConfig.saveScript(scripts.get(i))
         }
      }
   }

   Namespace.bindToNamespace("customizeyourweb", "ConfigDataConverter", ConfigDataConverter)
})()
}