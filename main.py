import requests
from moviepy.editor import VideoFileClip, concatenate_videoclips, TextClip, CompositeVideoClip
import shutil
import os
from dotenv import load_dotenv

# Create .env file path.
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')

# Load file from the path.
load_dotenv(dotenv_path)

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
CLIPS_DIR = os.getenv('CLIPS_DIR')
VIDEOS_DIR = os.getenv('VIDEOS_DIR')

if CLIPS_DIR == None:
    CLIPS_DIR = "./clips/"
if VIDEOS_DIR == None:
    VIDEOS_DIR = "./videos/"


def getAccessToken():
    res = requests.post(
        "https://id.twitch.tv/oauth2/token",
        params={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "client_credentials"
        })
    data = res.json()
    return data["access_token"]


ACCESS_TOKEN = getAccessToken()


def getUserId(name):
    res = requests.get("https://api.twitch.tv/helix/users", params={
        "login": name
    }, headers={
        "Client-ID": CLIENT_ID,
        "Authorization": "Bearer {}".format(ACCESS_TOKEN)
    })
    data = res.json()
    return data["data"][0]["id"]


def getBestClips(id, number=5):
    res = requests.get("https://api.twitch.tv/helix/clips", params={
        "broadcaster_id": id,
        "first": number
    }, headers={
        "Client-ID": CLIENT_ID,
        "Authorization": "Bearer {}".format(ACCESS_TOKEN)
    })
    return list(reversed(res.json()["data"]))


def downloadClips(clips):
    if not os.path.isdir(CLIPS_DIR):
        os.makedirs(CLIPS_DIR)

    paths = []
    for clip in clips:
        name = clip["id"] + ".mp4"
        name = "./clips/" + name

        if os.path.isfile(name):
            print("  Skipping the download of {} (already downloaded)".format(name))
            continue

        print("  Downloading {}...".format(clip["title"]))
        thumbail_url = clip["thumbnail_url"]
        base_url = thumbail_url.split("-preview-")
        mp4_url = base_url[0] + ".mp4"

        r = requests.get(mp4_url)
        with open(name, "wb") as code:
            code.write(r.content)
            paths.append(name)
            print("  Ok")
    return paths


def createVideo(channel_name, number):
    if not os.path.isdir(VIDEOS_DIR):
        os.makedirs(VIDEOS_DIR)

    print("Requesting best clips...")
    twitch_clips_data = getBestClips(getUserId(channel_name), number)
    print("Ok\nDownloading clips:")
    twitch_clips_files = downloadClips(twitch_clips_data)
    print("Ok\nRendering video...")

    duration = 0
    movie_clips = []

    for i, clip_path in enumerate(twitch_clips_files):
        clip_data = twitch_clips_data[i]

        vid_clip = VideoFileClip(clip_path).set_start(
            duration).crossfadein(0.75).crossfadeout(0.75)

        txt = "Clip #{}\n\"{}\" clipé par {}\n{} vues".format(
            len(twitch_clips_files) - i,
            clip_data["title"],
            clip_data["creator_name"],
            clip_data["view_count"]
        )
        txt_clip = TextClip(
            txt,
            fontsize=60,
            color='white',
            font="Roboto",
            size=vid_clip.size,
            method="caption",
            align="west"
        ).set_duration(max(4, vid_clip.duration - 1)).crossfadein(0.75).crossfadeout(0.75).set_start(duration)

        movie_clips.append(vid_clip)
        movie_clips.append(txt_clip)
        duration += vid_clip.duration

    name = VIDEOS_DIR + "bestof-{}-{}.mp4".format(number, channel_name)
    movie = CompositeVideoClip(movie_clips)
    movie.write_videofile(name)
    print("Ok")


if __name__ == "__main__":
    channel_name = input("Channel Name:")
    number_of_clips = int(input("Number of clips:"))
    createVideo(channel_name, number_of_clips)
