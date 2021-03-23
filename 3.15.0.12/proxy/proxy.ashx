<%@ WebHandler Language="C#" Class="Proxy" Debug="true" %>

using System;
using System.Web;
using System.Net;
using System.Text;
using System.IO;

public class Proxy : IHttpHandler {

  public void ProcessRequest(HttpContext context) {
    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

        try
        {
    context.Response.ContentType = "application/json";
    context.Response.AddHeader("Cache-Control", "no-store, no-cache, private");
    using (WebClient client = new WebClient()) {
      string[] hkeys = context.Request.Headers.AllKeys;
      string contenttype = null;
      foreach (string hkey in hkeys)
      {
        if (hkey == "Connection" || hkey == "Host" || hkey == "Accept-Encoding" || hkey == "Content-Length")
          continue;
        if (hkey == "Content-Type")
          contenttype = context.Request.Headers[hkey];
        string value = context.Request.Headers.Get(hkey);
        client.Headers.Add(hkey, value);
      }
      byte[] data = new byte[0];
      string url = context.Request.QueryString["url"];
      if (context.Request.RequestType == "POST")
      {
        if (contenttype == null)
          client.Headers.Add(HttpRequestHeader.ContentType, ""); // ???
        StreamReader bodyStream = new StreamReader(context.Request.InputStream);
        bodyStream.BaseStream.Seek(0, SeekOrigin.Begin);
        string body = bodyStream.ReadToEnd();
        data = client.UploadData(context.Request.QueryString["url"], "POST", Encoding.UTF8.GetBytes(body));
      }
      else if (context.Request.RequestType == "DELETE")
      {
        client.UploadString(url, "DELETE", "");
        return;
      }
      else if (context.Request.RequestType == "GET")
      {
        data = client.DownloadData(url);
      } else {
        //data = [61];
      }
      context.Response.BinaryWrite(data);
    }
       }
        catch (WebException e)
        {
            Stream s = e.Response.GetResponseStream();
            byte[] data = new byte[10000];
            int r = s.Read(data, 0, data.Length);

            byte[] wdata = new byte[r];
            Array.Copy(data, wdata, r);

            context.Response.StatusCode = (int)((e.Response as HttpWebResponse).StatusCode);
            context.Response.BinaryWrite(wdata);
        }


  }

  public bool IsReusable { get { return true; } }
}