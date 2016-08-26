using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text.RegularExpressions;

namespace Terrasoft.Core.Configuration
{	
	
public class FtpClient
	{
	#region Private members

		/// <summary>
		/// FTP server IP address or domain name
		/// </summary>
		private string _host;
		
		/// <summary>
		/// FTP login
		/// </summary>
		private string _loginName;

		/// <summary>
		/// FTP password
		/// </summary>
		private string _loginPassword;

		/// <summary>
		/// FTP request
		/// </summary>
		FtpWebRequest _ftpRequest;


		/// <summary>
		/// FTP response
		/// </summary>
		FtpWebResponse _ftpResponse;


		/// <summary>
		/// Use SSL flag
		/// </summary>
		private bool _useSSL;

	#endregion //Private members
		
		public FtpClient()
		{
			_useSSL = false;
		}


		/// <summary>
		/// Gets or sets the host.
		/// </summary>
		/// <value>
		/// FTP server IP address or domain name
		/// </value>
		public string Host
		{
			get
			{
				return _host;
			}
			set
			{
				_host = value;
			}
		}

		/// <summary>
		/// Gets or sets the login name.
		/// </summary>
		/// <value>
		/// FTP login
		/// </value>
		public string LoginName
		{
			get
			{
				return _loginName;
			}
			set
			{
				_loginName = value;
			}
		}

		/// <summary>
		/// Gets or sets the password.
		/// </summary>
		/// <value>
		/// FTP password.
		/// </value>
		public string LoginPassword
		{
			get
			{
				return _loginPassword;
			}
			set
			{
				_loginPassword = value;
			}
		}

		/// <summary>
		/// Gets or sets a value indicating whether SSL is using.
		/// </summary>
		/// <value>
		///   <c>true</c> if [use SSL]; otherwise, <c>false</c>.
		/// </value>
		public bool UseSSL
		{
			get
			{
				return _useSSL;
			}
			set
			{
				_useSSL = value;
			}
		}


		/// <summary>
		/// LIST FTP command
		/// </summary>
		/// <param name="path">The path.</param>
		/// <returns></returns>
		public FileStruct[] ListDirectory(string path)
		{
			if (string.IsNullOrEmpty(path))
			{
				path = "/";
			}
			_ftpRequest = (FtpWebRequest)WebRequest.Create("ftp://" + _host + path);
			_ftpRequest.Credentials = new NetworkCredential(_loginName, _loginPassword);
			_ftpRequest.Method = WebRequestMethods.Ftp.ListDirectoryDetails;
			_ftpRequest.EnableSsl = _useSSL;
			_ftpResponse = (FtpWebResponse)_ftpRequest.GetResponse();

			StreamReader sr = new StreamReader(_ftpResponse.GetResponseStream(), System.Text.Encoding.ASCII);
			string content = sr.ReadToEnd();
			sr.Close();
			_ftpResponse.Close();

			DirectoryListParser parser = new DirectoryListParser(content);
			return parser.FullListing;
		}

		//метод протокола FTP RETR для загрузки файла с FTP-сервера
		public void DownloadFile(string path, string fileName)
		{

			_ftpRequest = (FtpWebRequest)WebRequest.Create("ftp://" + _host + path + "/" + fileName);

			_ftpRequest.Credentials = new NetworkCredential(_loginName, _loginPassword);
			//команда фтп RETR
			_ftpRequest.Method = WebRequestMethods.Ftp.DownloadFile;

			_ftpRequest.EnableSsl = _useSSL;
			//Файлы будут копироваться в кталог программы
			FileStream downloadedFile = new FileStream(fileName, FileMode.Create, FileAccess.ReadWrite);

			_ftpResponse = (FtpWebResponse)_ftpRequest.GetResponse();
			//Получаем входящий поток
			Stream responseStream = _ftpResponse.GetResponseStream();

			//Буфер для считываемых данных
			byte[] buffer = new byte[1024];
			int size = 0;

			while ((size = responseStream.Read(buffer, 0, 1024)) > 0)
			{
				downloadedFile.Write(buffer, 0, size);

			}
			_ftpResponse.Close();
			downloadedFile.Close();
			responseStream.Close();
		}
		//метод протокола FTP STOR для загрузки файла на FTP-сервер
		public void UploadFile(string path, string fileName)
		{
			//для имени файла
			string shortName = fileName.Remove(0, fileName.LastIndexOf("\\") + 1);

			FileStream uploadedFile = new FileStream(fileName, FileMode.Open, FileAccess.Read);

			_ftpRequest = (FtpWebRequest)WebRequest.Create("ftp://" + _host + path + shortName);
			_ftpRequest.Credentials = new NetworkCredential(_loginName, _loginPassword);
			_ftpRequest.EnableSsl = _useSSL;
			_ftpRequest.Method = WebRequestMethods.Ftp.UploadFile;

			//Буфер для загружаемых данных
			byte[] file_to_bytes = new byte[uploadedFile.Length];
			//Считываем данные в буфер
			uploadedFile.Read(file_to_bytes, 0, file_to_bytes.Length);

			uploadedFile.Close();

			//Поток для загрузки файла 
			Stream writer = _ftpRequest.GetRequestStream();

			writer.Write(file_to_bytes, 0, file_to_bytes.Length);
			writer.Close();
		}

		/// <summary>
		/// Creates file on ftp server from byte-array content data
		/// </summary>
		/// <param name="path">Path to the file</param>
		/// <param name="shortName">Short name of the file to create</param>
		/// <param name="content">Byte data to be written</param>
		/// <param name="length">Number of bytes to write.</param>
		public void CreateFileFromContent(string path, string shortName, byte[] content, int length)
		{
			_ftpRequest = (FtpWebRequest)WebRequest.Create("ftp://" + _host + path + shortName);
			_ftpRequest.Credentials = new NetworkCredential(_loginName, _loginPassword);
			_ftpRequest.EnableSsl = _useSSL;
			_ftpRequest.Method = WebRequestMethods.Ftp.UploadFile;

			Stream writer = _ftpRequest.GetRequestStream();

			writer.Write(content, 0, length);
			writer.Close();
		}

		//метод протокола FTP DELE для удаления файла с FTP-сервера 
		public void DeleteFile(string path)
		{
			_ftpRequest = (FtpWebRequest)WebRequest.Create("ftp://" + _host + path);
			_ftpRequest.Credentials = new NetworkCredential(_loginName, _loginPassword);
			_ftpRequest.EnableSsl = _useSSL;
			_ftpRequest.Method = WebRequestMethods.Ftp.DeleteFile;

			FtpWebResponse ftpResponse = (FtpWebResponse)_ftpRequest.GetResponse();
			ftpResponse.Close();
		}

		//метод протокола FTP MKD для создания каталога на FTP-сервере 
		public void CreateDirectory(string path, string folderName)
		{
			FtpWebRequest ftpRequest = (FtpWebRequest)WebRequest.Create("ftp://" + _host + path + folderName);

			ftpRequest.Credentials = new NetworkCredential(_loginName, _loginPassword);
			ftpRequest.EnableSsl = _useSSL;
			ftpRequest.Method = WebRequestMethods.Ftp.MakeDirectory;

			FtpWebResponse ftpResponse = (FtpWebResponse)ftpRequest.GetResponse();
			ftpResponse.Close();
		}
		//метод протокола FTP RMD для удаления каталога с FTP-сервера 
		public void RemoveDirectory(string path)
		{
			string filename = path;
			FtpWebRequest ftpRequest = (FtpWebRequest)WebRequest.Create("ftp://" + _host + path);
			ftpRequest.Credentials = new NetworkCredential(_loginName, _loginPassword);
			ftpRequest.EnableSsl = _useSSL;
			ftpRequest.Method = WebRequestMethods.Ftp.RemoveDirectory;

			FtpWebResponse ftpResponse = (FtpWebResponse)ftpRequest.GetResponse();
			ftpResponse.Close();
		}
	}
	//Для парсинга полученного детального списка каталогов фтп-сервера
	//Структура для хранения детальной информации о файде или каталоге
	public struct FileStruct
	{
		public string Flags;
		public string Owner;
		public bool IsDirectory;
		public string CreateTime;
		public string Name;
	}

	public enum FileListStyle
	{
		UnixStyle,
		WindowsStyle,
		Unknown
	}

	public class DirectoryListParser
	{
		private List<FileStruct> _myListArray;
		public FileStruct[] FullListing
		{
			get
			{
				return _myListArray.ToArray();
			}
		}

		public FileStruct[] FileList
		{
			get
			{
				List<FileStruct> _fileList = new List<FileStruct>();
				foreach (FileStruct thisstruct in _myListArray)
				{
					if (!thisstruct.IsDirectory)
					{
						_fileList.Add(thisstruct);
					}
				}
				return _fileList.ToArray();
			}
		}

		public FileStruct[] DirectoryList
		{
			get
			{
				List<FileStruct> _dirList = new List<FileStruct>();
				foreach (FileStruct thisstruct in _myListArray)
				{
					if (thisstruct.IsDirectory)
					{
						_dirList.Add(thisstruct);
					}
				}
				return _dirList.ToArray();
			}
		}

		public DirectoryListParser(string responseString)
		{
			_myListArray = GetList(responseString);
		}

		private List<FileStruct> GetList(string datastring)
		{
			List<FileStruct> myListArray = new List<FileStruct>();
			string[] dataRecords = datastring.Split('\n');
			//Получаем стиль записей на сервере
			FileListStyle _directoryListStyle = GuessFileListStyle(dataRecords);
			foreach (string s in dataRecords)
			{
				if (_directoryListStyle != FileListStyle.Unknown && s != "")
				{
					FileStruct f = new FileStruct();
					f.Name = "..";
					switch (_directoryListStyle)
					{
						case FileListStyle.UnixStyle:
							f = ParseFileStructFromUnixStyleRecord(s);
							break;
						case FileListStyle.WindowsStyle:
							f = ParseFileStructFromWindowsStyleRecord(s);
							break;
					}
					if (f.Name != "" && f.Name != "." && f.Name != "..")
					{
						myListArray.Add(f);
					}
				}
			}
			return myListArray;
		}
		//Парсинг, если фтп сервера работает на Windows
		private FileStruct ParseFileStructFromWindowsStyleRecord(string Record)
		{
			//Предположим стиль записи 02-03-04  07:46PM       <DIR>     Append
			FileStruct f = new FileStruct();
			string processstr = Record.Trim();
			//Получаем дату
			string dateStr = processstr.Substring(0, 8);
			processstr = (processstr.Substring(8, processstr.Length - 8)).Trim();
			//Получаем время
			string timeStr = processstr.Substring(0, 7);
			processstr = (processstr.Substring(7, processstr.Length - 7)).Trim();
			f.CreateTime = dateStr + " " + timeStr;
			//Это папка или нет
			if (processstr.Substring(0, 5) == "<DIR>")
			{
				f.IsDirectory = true;
				processstr = (processstr.Substring(5, processstr.Length - 5)).Trim();
			}
			else
			{
				string[] strs = processstr.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
				processstr = strs[1];
				f.IsDirectory = false;
			}
			//Остальное содержмое строки представляет имя каталога/файла
			f.Name = processstr;
			return f;
		}
		//Получаем на какой ОС работает фтп-сервер - от этого будет зависеть дальнейший парсинг
		public FileListStyle GuessFileListStyle(string[] recordList)
		{
			foreach (string s in recordList)
			{
				//Если соблюдено условие, то используется стиль Unix
				if (s.Length > 10
					&& Regex.IsMatch(s.Substring(0, 10), "(-|d)((-|r)(-|w)(-|x)){3}"))
				{
					return FileListStyle.UnixStyle;
				}
				//Иначе стиль Windows
				else if (s.Length > 8
					&& Regex.IsMatch(s.Substring(0, 8), "[0-9]{2}-[0-9]{2}-[0-9]{2}"))
				{
					return FileListStyle.WindowsStyle;
				}
			}
			return FileListStyle.Unknown;
		}
		//Если сервер работает на nix-ах
		private FileStruct ParseFileStructFromUnixStyleRecord(string record)
		{
			//Предположим. тчо запись имеет формат dr-xr-xr-x   1 owner    group    0 Nov 25  2002 bussys
			FileStruct f = new FileStruct();
			if (record[0] == '-' || record[0] == 'd')
			{// правильная запись файла
				string processstr = record.Trim();
				f.Flags = processstr.Substring(0, 9);
				f.IsDirectory = (f.Flags[0] == 'd');
				processstr = (processstr.Substring(11)).Trim();
				//отсекаем часть строки
				_cutSubstringFromStringWithTrim(ref processstr, ' ', 0);
				f.Owner = _cutSubstringFromStringWithTrim(ref processstr, ' ', 0);
				f.CreateTime = getCreateTimeString(record);
				//Индекс начала имени файла
				int fileNameIndex = record.IndexOf(f.CreateTime, System.StringComparison.Ordinal) + f.CreateTime.Length;
				//Само имя файла
				f.Name = record.Substring(fileNameIndex).Trim();
			}
			else
			{
				f.Name = "";
			}
			return f;
		}

		private string getCreateTimeString(string record)
		{
			//Получаем время
			const string month = "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)";
			const string space = @"(\040)+";
			const string day = "([0-9]|[1-3][0-9])";
			const string year = "[1-2][0-9]{3}";
			const string time = "[0-9]{1,2}:[0-9]{2}";
			Regex dateTimeRegex = new Regex(month + space + day + space + "(" + year + "|" + time + ")", RegexOptions.IgnoreCase);
			Match match = dateTimeRegex.Match(record);
			return match.Value;
		}

		private string _cutSubstringFromStringWithTrim(ref string s, char c, int startIndex)
		{
			int pos1 = s.IndexOf(c, startIndex);
			string retString = s.Substring(0, pos1);
			s = (s.Substring(pos1)).Trim();
			return retString;
		}
	}
}