//====================================================//
//   Using an Access Token to Query the HubSpot API   //
//====================================================//

const getContact = async (accessToken) => {
    console.log('Retrieving a contact from HubSpot using an access token');
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      const result = await request.get('https://api.hubapi.com/contacts/v1/lists/all/contacts/all?count=1', {
        headers: headers
      });

      return JSON.parse(result).contacts[0];
    } catch (e) {
      console.error('  > Unable to retrieve contact');
      return JSON.parse(e.response.body);
    }
  };

  //========================================//
  //   Displaying information to the user   //
  //========================================//

  const displayContactName = (res, contact) => {
    if (contact.status === 'error') {
      res.write(`<p>Unable to retrieve contact! Error Message: ${contact.message}</p>`);
      return;
    }
    const { firstname, lastname } = contact.properties;
    res.write(`<p>Contact name: ${firstname.value} ${lastname.value}</p>`);
  };

  app.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write(`<h2>HubSpot OAuth 2.0 Quickstart App</h2>`);
    if (isAuthorized(req.sessionID)) {
      const accessToken = await getAccessToken(req.sessionID);
      const contact = await getContact(accessToken);
      res.write(`<h4>Access token: ${accessToken}</h4>`);
      displayContactName(res, contact);
    } else {
      res.write(`<h4>Access token:</h4>`);
      res.write(`<a href="/install">Install</a>`);
    }
    res.end();
  });

  app.get('/error', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write(`<h4>Error: ${req.query.msg}</h4>`);
    res.end();
  });

