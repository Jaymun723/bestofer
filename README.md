# Twitch BestOfer

> Created by [Jaymun723](https://github.com/jaymun723). Idea by Otarios.

## Installation

First install [ImageMagic](https://imagemagick.org/script/download.php).
If you're on windows refer to [Moviepy documentation](https://zulko.github.io/moviepy/install.html#other-optional-but-useful-dependencies) to ensure ImageMagic installation.

```sh
pip install -r requirements.txt
```

Create a twitch app on https://dev.twitch.tv and copy the client-id and client-secret.
Create a `.env` file and put the client id and secret. For an example look at `.env.example`.

## Create a video

The python script will ask you the twitch channel name and the numbers of clips.

```sh
python main.py
```

The video will be outputted by default in the `videos` folder.
