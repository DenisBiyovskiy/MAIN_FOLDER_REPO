using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace GAPITEST
{
    class Tools
    {
        public static void WriteToFile(string s, bool append)
        {
            string path = "C:\\Users\\Public\\Documents\\testOut.txt";
            string divider = "\n--------------------------------------------";
            var sw = new StreamWriter(path, append);
            sw.WriteLine(s + divider);
            sw.Close();

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
