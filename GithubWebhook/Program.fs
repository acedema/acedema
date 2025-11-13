namespace GithubWebhook

open Falco
open Falco.Routing
open Microsoft.AspNetCore.Builder
open FSharp.Data
open Microsoft.Extensions.DependencyInjection
open System.Text.Json
open FSharp.Data.JsonPath

type Error = { Code: string; Message: string }

module ErrorResponse =

    let badRequest error : HttpHandler =
        Response.withStatusCode 400 >> Response.ofJson error

    let notFound: HttpHandler =
        Response.withStatusCode 404
        >> Response.ofJson { Code = "404"; Message = "Not Found" }

    let serverException: HttpHandler =
        Response.withStatusCode 500
        >> Response.ofJson
            {
                Code = "500"
                Message = "Server Error"
            }

module WebHook =
    open System.IO
    open Microsoft.Extensions.Configuration

    type Action =
        | Published
        | Updated

    type EventType =
        | Package
        | Push

    type GithubPayload =
        {
            name: string
            action: string
            event: string
            url: string
        }

    let webhookEndpoint = "/webhook"

    let writeToFile file payload =
        task {
            let json = JsonSerializer.Serialize payload
            use file = File.Create file
            let bytes = System.Text.Encoding.UTF8.GetBytes json
            do! file.WriteAsync(System.ReadOnlyMemory bytes)
        }

    let webhookHandler: HttpHandler =
        fun ctx ->
            task {
                let headers = Request.getHeaders ctx
                let! (body: string) = Request.getBodyString ctx
                let jsonvalue = body |> JsonValue.TryParse

                let action =
                    jsonvalue
                    |> Option.map (fun v -> v |> JsonPath.tryFind "$.action")
                    |> Option.flatten
                    |> Option.map (fun v ->
                        if v.ToString().Contains "published" then
                            Published
                        else
                            Updated)

                let url =
                    jsonvalue
                    |> Option.map (fun v -> v |> JsonPath.tryFind "$.package..package_url")
                    |> Option.flatten

                let name =
                    jsonvalue
                    |> Option.map (fun v -> v |> JsonPath.tryFind "$.package.name")
                    |> Option.flatten

                match action with
                | Some v -> printfn "json value: %s" (v.ToString())
                | None -> printfn "cannot convert value"

                match url with
                | Some v -> printfn "json value: %s" (v.ToString())
                | None -> printfn "cannot convert value"

                let events =
                    headers.AsKeyValues()
                    |> List.filter (fun (key, data) -> key.Contains "x-github-event")

                let event =
                    snd events.Head
                    |> fun req_data ->
                        if req_data.AsString().Contains "package" then
                            Package
                        else
                            Push

                let payload =
                    {
                        name = name |> Option.map (fun v -> v.ToString().Trim '\"') |> Option.get
                        action = action |> Option.map (fun v -> v.ToString()) |> Option.get
                        event = event.ToString()
                        url = url |> Option.map (fun v -> v.ToString().Trim '\"') |> Option.get
                    }

                let path = ctx.Plug<IConfigurationSection>()
                printfn "%s" path.Value

                do! writeToFile $"{path.Value}/{payload.name}_deployment.json" payload

                return! Response.ofJson <| {| status = "ok" |} <| ctx

            }

module Program =
    open Microsoft.Extensions.Configuration

    [<EntryPoint>]
    let main args =
        let builder = WebApplication.CreateBuilder args

        let path = builder.Configuration.GetSection "DeploymentDefinitionRoot"

        builder.Services.AddSingleton<IConfigurationSection> path |> ignore
        let wapp = builder.Build()

        let endpoints = [ post WebHook.webhookEndpoint WebHook.webhookHandler ]

        wapp.UseRouting().UseFalco(endpoints).Run()
        0
