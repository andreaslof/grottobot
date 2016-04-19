export default `
<!DOCTYPE html>
<html>
<head>
  <meta content="content-type" content="text/html; charset=utf-8">
  <title>Grottobot - <%= pageTitle %></title>
  <meta name="viewport" content="initial-scale=1.0, width=device-width">
  <style type="text/css">
    body, html {
      margin: 0;
      padding: 0;
    }

    body {
      font-family: sans-serif;
      font-size: 1.4vw;
    }

    [role=main] {
      margin: 5vh auto;
      max-width: 40vw;
    }

    @media screen and (max-width: 60em) {
      body {
        font-size: 2vw;
      }

      [role=main] {
        max-width: 60vw;
      }
    }

    @media screen and (max-width: 30em) {
      body {
        font-size: 4vw;
      }

      [role=main] {
        max-width: 90vw;
      }
    }
  </style>
</head>
<body>
  <main role="main">
    <%= content %>
  </main>
</body>
</html>
`;
