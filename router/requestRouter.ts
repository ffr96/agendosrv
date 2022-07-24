import express, { Request } from 'express';
import mPatient from '../schema/patient';
import { parseString } from '../utils/parsers';

const router = express.Router();

/*
** If there's a token in the request (the user is logged in) send 
** the actual data, otherwise send only dates and no other info
*/

router.get('/', async(req: Request, res) => {
  const fetchPatients = async(str = '') => {
    try {
      const patients = await mPatient.find().select(str);
      return patients;
    }
    catch(e) {
      res.status(500).send('Error fetching patients');
      return null;
    }
  };

  if (req.user) {
    const patWithData = await fetchPatients();
    return res.send(patWithData);
  } else {
    const data = await fetchPatients('meeting');
    return res.send(data);
  }
});

/**
 * Updates a meeting detail
 */

router.put('/:dni/:id', async(req,res) => {
  try {
    if (req.user) {
      const updatedMeeting = {
        inDate: new Date(parseString(req.body.inDate)),
        outDate: new Date(parseString(req.body.outDate)),
        meetingType: parseString(req.body.type),
        meetingLocation: parseString(req.body.location)         
      };

      const patient = await mPatient.findOneAndUpdate(
        { dni: req.params.dni, "meeting._id": req.params.id },
        { "$set": { "meeting.$": updatedMeeting}}, {new: true}
      );
      if (patient) {
        const newMeeting = patient.meeting.pop();
        return res.send({
          _id: patient._id as string,
          name: patient.name,
          surname: patient.surname,
          dni: patient.dni,
          meeting: newMeeting
        });
      } else {
        return res.status(404).send('meeting not found').end();
      }
    } else {
      return res.status(405).send('login required').end();
    }
  } catch(e) {
    return console.error((e as Error).message);
  }
});

/**
 * Adds a new user or a new meeting to an existing user
 */

router.post('/:dni', async(req,res) => {
  try {
    if (req.user) {
      if (req.params.dni === req.body.dni) {
        let patient = await mPatient.findOne({dni: req.params.dni});
        let newMeeting = null;
        const meeting = {
          inDate: new Date(parseString(req.body.inDate)),
          outDate: new Date(parseString(req.body.outDate)),
          meetingType: parseString(req.body.type),
          meetingLocation: parseString(req.body.location)
        };
    
        if (patient) {
          patient.meeting.push(meeting);
          await patient.save();
          newMeeting = patient.meeting.pop();
          console.log(newMeeting);
        } else {
          patient = new mPatient({
            name: parseString(req.body.name),
            surname: parseString(req.body.surname),
            notes: parseString(req.body.notes),
            dni: parseString(req.body.dni),
            meeting: meeting,
          });
          await patient.save();
          newMeeting = patient.meeting.pop();
          console.log(newMeeting);
        }
        return res.send({
          _id: patient._id as string,
          name: patient.name,
          surname: patient.surname,
          meeting: newMeeting,
          notes: patient.notes,
          dni: patient.dni,
        });
      } else {
        return res.status(405).send('user and dni dont match');
      }
    } else {
      return res.status(405).send('login required').end();
    }
  } catch(e) {
    console.log(e);
    return res.status(504).send((e as Error).message);
  }

});

// delete one meeting
router.delete('/:dni/:id', async(req,res) => {
  if (req.user) {
    try {
      await mPatient.findOneAndUpdate(
        { dni: req.params.dni },
        { "$pull": { meeting: {_id: req.params.id} }}
      ); 

      return res.status(200).end();
    }
    catch(e) {
      return res.status(500).send((e as Error).message);
    }
  } else {
    return res.status(405).send('Login required');
  }
});


// delete everything
router.delete('/', async(req,res) => {
  if (req.user) {
    try {
      await mPatient.deleteMany({});
      return res.status(200).end();
    }
    catch(e) {
      console.log('unable to delete patients',e);
      return res.status(500).end();
    }
  } else {
    return res.status(405).send('Login required');
  }
    
});

export default router;