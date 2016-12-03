var slack = slack || {};

slack.api = {
    code: function () {
        // grab code query param out of uri
        var query = $.qs.parse(location.search) || {};
        $.qs.reset(); // remove query params
        return query.code;
    },

    authorize: function () {
        var scopes = [
            'channels:read',
            'channels:write',
            'chat:write:user',
            'users:read',
            'bot'
        ];

        var params = {
            client_id: slack.client_id,
            scope: scopes.join(' '),
            redirect_uri: slack.redirect_uri,
            team: slack.team
        };

        var url = 'https://slack.com/oauth/authorize?' + $.param(params);

        window.location.href = url;
    },

    token: function (code) {
        if (!code) return;

        var url = 'https://slack.com/api/oauth.access';

        return slack.api.request(url, {
            client_id: slack.client_id,
            client_secret: slack.client_secret,
            redirect_uri: slack.redirect_uri,
            code: code
        });
    },

    rtm: function (bot_access_token) {
        var url = 'https://slack.com/api/rtm.start';

        return slack.api.request(url, {
            token: bot_access_token,
            simple_latest: true,
            no_unreads: true
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 429) {
                console.log("Rate Limit exceeded, please try to refresh in 60 seconds");
            }
        });

    },

    post: function (message, channel) {
        if (!message) return;

        var url = 'https://slack.com/api/chat.postMessage';

        return slack.api.request(url, {
            token: slack.api.access_token,
            channel: channel,
            text: message,
            as_user: true
        });
    },

    delete: function (ts, channel) {
        if (!ts) return;

        var url = 'https://slack.com/api/chat.delete';

        return slack.api.request(url, {
            token: slack.api.access_token,
            ts: ts,
            channel: channel,
            as_user: true
        });
    },

    join: function (channel) {
        if (!channel) return;

        var url = 'https://slack.com/api/channels.join';

        return slack.api.request(url, {
            token: slack.api.access_token,
            name: channel
        });
    },

    part: function (channel) {
        if (!channel) return;

        var url = 'https://slack.com/api/channels.leave';

        return slack.api.request(url, {
            token: slack.api.access_token,
            name: channel
        });
    },

    channel: {
        info: function (channel) {
            if (!channel) return;

            var url = 'https://slack.com/api/channels.info';

            return slack.api.request(url, {
                token: slack.api.access_token,
                channel: channel
            });
        }
    },

    request: function (url, params) {
        var request = {
            url: url + '?' + $.param(params),
            method: 'GET'
        };

        return $.ajax(request);
    },

    identify: function () {
        var identity = localStorage.getItem('slack_identity');

        if (identity) {
            slack.identity = JSON.parse(identity);
            return;
        }

        var channel = slack.channels[slack.channel];
        slack.api.join(channel.name).then(function () {
            slack.api.post('Automated Message', channel.id).done(function (response) {
                slack.api.delete(response.ts, channel.id);

                slack.identity = slack.users[response.message.user];
                localStorage.setItem('slack_identity', JSON.stringify(slack.identity));
            });
        });
    },

    login: function () {
        var code = slack.api.code();

        if (!code) {
            var access_token = localStorage.getItem('access_token');
            var bot_access_token = localStorage.getItem('bot_access_token');

            if (access_token && bot_access_token) {
                slack.api.access_token = access_token;

                return slack.api.rtm(bot_access_token);
            }

            return slack.api.authorize();
        }

        return slack.api.token(code).then(function (response) {
            slack.api.access_token = response.access_token;
            var bot_access_token = response.bot.bot_access_token;

            localStorage.setItem('access_token', slack.api.access_token);
            localStorage.setItem('bot_access_token', bot_access_token);

            return slack.api.rtm(bot_access_token);
        });
    }
};