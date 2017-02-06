namespace FacebookGraphAPIHelper.Objects
{
    interface IFacebookCollection
    {
        IFacebookCollection ConcatFBObjects<IFacebookCollection>();

        IFacebookCollection GetObjectData();
    }
}
