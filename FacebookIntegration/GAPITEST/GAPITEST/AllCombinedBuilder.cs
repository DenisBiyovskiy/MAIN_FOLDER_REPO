using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GAPITEST
{
    public static class AllCombinedBuilder
    {
        private static string rootDirPath = @"D:\MF\MAIN_FOLDER_REPO\FacebookIntegration\FacebookGraphAPIHelper\FacebookGraphAPIHelper";
        private static string[] subDirsPath = { @"D:\MF\MAIN_FOLDER_REPO\FacebookIntegration\FacebookGraphAPIHelper\FacebookGraphAPIHelper\Objects" };
        private const string _ns = "namespace";
        private static Dictionary<string, Dictionary<string, string>> nsDic = new Dictionary<string, Dictionary<string, string>>();
        private static HashSet<string> usings = new HashSet<string>();
        private static StringBuilder result = new StringBuilder();
        public static void build()
        {
            Tools.ClearFile();
            getAllUsingsAndText();
            combineFilesData();
            Tools.WriteStringToFile(result.ToString());
        }

        public static void combineFilesData()
        {
            foreach (var s in usings)
            {
                result.Append(s);
            }
            result.Append("\n\n");
            foreach (var key in nsDic.Keys)
            {
                var nsString = _ns + " " + key + "\n{";
                result.Append(nsString);
                foreach (var k in nsDic[key].Keys)
                {
                    var d = nsDic[key];
                    var t = d[k];
                    var nsInd = t.IndexOf("{");
                    var lastInd = t.LastIndexOf("}");
                    var text = t.Substring(nsInd + 1, lastInd - nsInd - 1);
                    result.Append(text);
                }
                result.Append("\n}\n\n");
            }
        }

        public static void addClassToNamespace(string ns, string fn, string text)
        {
            Dictionary<string, string> res = null;
            if (!nsDic.TryGetValue(ns, out res)) res = new Dictionary<string, string>();
            res.Add(fn, text);
            nsDic[ns] = res;
        }

        public static void getAllUsingsAndText()
        {
            try
            {
                string[] arrFilePaths = Directory.GetFiles(rootDirPath, "*.cs", SearchOption.TopDirectoryOnly);
                var filePaths = arrFilePaths.ToList<string>();
                foreach (string p in filePaths)
                {
                    var fileName = getFileName(p);
                    string text = System.IO.File.ReadAllText(p);
                    var ns = getNamespace(text);
                    addClassToNamespace(ns, fileName, text);
                    getUsings(text, fileName, ns);
                }
                foreach (var d in subDirsPath)
                {
                    string[] paths = Directory.GetFiles(d, "*.cs", SearchOption.TopDirectoryOnly);
                    foreach (var p in paths)
                    {
                        string text = System.IO.File.ReadAllText(p);
                        string fileName = getFileName(p);
                        var ns = getNamespace(text);
                        addClassToNamespace(ns, fileName, text);
                        getUsings(text, fileName, ns);
                    }
                }

            }
            catch (Exception e)
            {
                Tools.WriteToFile(String.Format("The process failed: {0}", e.ToString()));
            }
        }

        public static string getNamespace(string text)
        {
            var sInd = text.IndexOf(_ns) + _ns.Length;
            var eInd = text.IndexOf("{");
            var ns = text.Substring(sInd, eInd - sInd);
            char[] c = { '\n', '\r', ' ' };
            ns = ns.Trim(c);
            return ns;
        }

        public static void getUsings(string text, string fileName, string nameSpace)
        {
            int nsInd = text.IndexOf(_ns + " " + nameSpace);
            string usingsTxt = text.Substring(0, nsInd);
            string[] usings = usingsTxt.Split('\n');
            foreach (var u in usings)
            {
                if (u.Contains("using")) AllCombinedBuilder.usings.Add(u);
            }
        }
        public static string getFileName(string path)
        {
            var dir = getDirName(path);
            return dir.Substring(0, dir.Length - 3);
        }

        public static string getDirName(string path)
        {
            var startFileNameInd = path.LastIndexOf("\\") + 1;
            return path.Substring(startFileNameInd, path.Length - startFileNameInd);
        }
    }
}
