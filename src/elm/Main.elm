module Main exposing (main)

import Browser exposing (Document, UrlRequest)
import Browser.Navigation as Navigation
import Html as H
import Html.Events as E
import Url exposing (Url)


type alias Flags =
    { baseUrl : String
    }


type alias Model =
    { environment : Environment
    , key : Navigation.Key
    , count : Int
    }


type alias Environment =
    { baseUrl : String
    }


type Msg
    = UrlRequested UrlRequest
    | UrlChanged Url
    | Decrement
    | Increment


main : Program Flags Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        , onUrlRequest = UrlRequested
        , onUrlChange = UrlChanged
        }


init : Flags -> Url -> Navigation.Key -> ( Model, Cmd Msg )
init flags url key =
    let
        environment =
            { baseUrl = flags.baseUrl }
    in
        ( { environment = environment
          , key = key
          , count = 0
          }
        , Cmd.none
        )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UrlRequested urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Navigation.pushUrl model.key <| Url.toString url )

                Browser.External href ->
                    ( model, Navigation.load href )

        UrlChanged url ->
            -- TODO
            ( model, Cmd.none )

        Decrement ->
            ( { model | count = model.count - 1 }, Cmd.none )

        Increment ->
            ( { model | count = model.count + 1 }, Cmd.none )


view : Model -> Document Msg
view model =
    { title = "Elm App"
    , body =
        [ H.button [ E.onClick Decrement ] [ H.text "-" ]
        , H.text <| String.fromInt model.count
        , H.button [ E.onClick Increment ] [ H.text "+" ]
        ]
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
