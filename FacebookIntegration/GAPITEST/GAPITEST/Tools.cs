using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;

namespace GAPITEST
{
    class Tools
    {
        private static string  filePath = "C:\\Users\\Public\\Documents\\testOut.txt"; 

        public static string CharsCodedStringToString(string s)
        {
            var ca = s.ToCharArray();
            var newS = "";
            foreach (var c in ca)
            {
                newS += c;
            }
            return newS;
        }

        public static void WriteToFile(string s, bool append = true)
        {
            string divider = "\n//-----------------------------------------------------";
            using (var sw = new StreamWriter(filePath, append))
            {
                sw.WriteLine(s + divider);
            }

        }

        public static void WriteStringToFile(Object o, bool append = true)
        {
            WriteToFile(o != null ? o.ToString() : "null passed in o parameter.");
        }

        public static void WriteToFile(Object o, bool append = true)
        {
            WriteToFile(FormatJSON(o), append);
        }

        public static void ClearFile()
        {
            WriteToFile("", false);
        }
        public static string FormatJSON(Object o)
        {
            return FormatJSON(JsonConvert.SerializeObject(o));
        }

        public static string FormatJSON(string s)
        {
            string tab = " ";
            string curTab = "";
            string nl = "\n";
            int count = 0;
            char[] a = s.ToCharArray();
            var sb = new StringBuilder(s);
            for (var i = 0; i < a.Length; i++)
            {
                if (a[i] == ',')
                {
                    sb.Insert(i + count + 1, nl + curTab);
                    count += curTab.Length + 1;
                }
                else
                    if (a[i] == '{' || a[i] == '[')
                    {
                        curTab += tab;
                        sb.Insert(i + count + 1, nl + curTab);
                        count += curTab.Length + 1;
                    }
                    else
                        if (a[i] == '}' || a[i] == ']')
                        {
                            curTab = curTab.Substring(0, curTab.Length - 1);
                            sb.Insert(i + count, nl + curTab);
                            count += curTab.Length + 1;
                        }

            }
            return sb.ToString();
        }
    }
}
