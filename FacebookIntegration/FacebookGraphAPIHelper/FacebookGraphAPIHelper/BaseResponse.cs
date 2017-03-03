using System;
using System.Runtime.Serialization;
namespace FacebookGraphAPIHelper
{
    /// <summary>
    /// The response object to return the result of request to GraphAPI.
    /// </summary>
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
        /// Gets or sets response Exception. Sets success to false with <c>set</c> action.
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
        /// Default constructor, returns new instance of BaseResponse.
        /// Sets <c>success</c> field to true.
        /// </summary>
        public BaseResponse()
        {
            Exception = null;
            success = true;
        }
    }
}
