using System;
using System.Runtime.Serialization;
namespace FacebookGraphAPIHelper
{
    [DataContract]
    public class BaseResponse
    {
        private Exception _Exception { get; set; }

        /// <summary>
        /// Indicates whether the response succed or not.
        /// </summary>
        [DataMember]
        public bool success;
        /// <summary>
        /// Response data in JSON format.
        /// </summary>
        [DataMember]
        public string responseData;
        /// <summary>
        /// Contains information about response error. Sets success to false with set action.
        /// </summary>
        [DataMember]
        public Exception Exception
        {
            get
            {
                return _Exception;
            }
            set
            {
                success = false;
                _Exception = value;
            }
        }

        /// <summary>
        /// Default constructors, returns new instance of BaseResponse
        /// sets success field to true.
        /// </summary>
        public BaseResponse()
        {
            Exception = null;
            success = true;
        }
    }
}
